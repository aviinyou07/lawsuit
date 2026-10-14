import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../database/index.js';
import { authenticateToken } from '../../common/auth.middleware.js';
import { validateBody } from '../../common/validation.middleware.js';

export const bookingRouter = Router();

// 1. Calculate Booking Quote
const calculateQuoteSchema = z.object({
  lawyer_id: z.string().min(10),
  consultation_mode: z.enum(['CHAT', 'AUDIO', 'VIDEO', 'OFFLINE']),
});

bookingRouter.post('/calculate-quote', authenticateToken, validateBody(calculateQuoteSchema), async (req: Request, res: Response) => {
  const { lawyer_id, consultation_mode } = req.body;

  const lawyerRes = await query(
    `SELECT consultation_fee_chat, consultation_fee_audio, consultation_fee_video, consultation_fee_offline, platform_commission_rate
     FROM lawyer_profiles WHERE user_id = $1`,
    [lawyer_id]
  );

  if (lawyerRes.rows.length === 0) {
    res.status(404).json({ success: false, message: 'Lawyer not found' });
    return;
  }

  const lawyer = lawyerRes.rows[0];
  let baseFee = 999.00;
  if (consultation_mode === 'CHAT') baseFee = parseFloat(lawyer.consultation_fee_chat);
  if (consultation_mode === 'AUDIO') baseFee = parseFloat(lawyer.consultation_fee_audio);
  if (consultation_mode === 'VIDEO') baseFee = parseFloat(lawyer.consultation_fee_video);
  if (consultation_mode === 'OFFLINE') baseFee = parseFloat(lawyer.consultation_fee_offline);

  const platformFee = 99.00; // Platform convenience fee
  const taxAmount = parseFloat(((baseFee + platformFee) * 0.18).toFixed(2)); // 18% GST
  const totalAmount = parseFloat((baseFee + platformFee + taxAmount).toFixed(2));
  const commissionRate = parseFloat(lawyer.platform_commission_rate || '15.00');
  const lawyerNetEarnings = parseFloat((baseFee * (1 - commissionRate / 100)).toFixed(2));

  res.json({
    success: true,
    data: {
      consultation_mode,
      base_fee: baseFee,
      platform_fee: platformFee,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      lawyer_net_earnings: lawyerNetEarnings,
      currency: 'INR',
    },
  });
});

// 2. Create Appointment & Booking
const createBookingSchema = z.object({
  lawyer_id: z.string().min(10),
  category_id: z.string().min(10).optional(),
  consultation_mode: z.enum(['CHAT', 'AUDIO', 'VIDEO', 'OFFLINE']),
  scheduled_start: z.string(),
  client_case_brief: z.string().optional(),
});

bookingRouter.post('/create', authenticateToken, validateBody(createBookingSchema), async (req: Request, res: Response) => {
  const clientId = req.user!.userId;
  const { lawyer_id, category_id, consultation_mode, scheduled_start, client_case_brief } = req.body;

  const startDate = new Date(scheduled_start);
  const slotMinutes = consultation_mode === 'OFFLINE' ? 45 : 20;
  const endDate = new Date(startDate.getTime() + slotMinutes * 60 * 1000);

  // Check if slot is already booked
  const conflictCheck = await query(
    `SELECT id FROM appointments
     WHERE lawyer_id = $1
       AND status IN ('CONFIRMED', 'PENDING', 'IN_PROGRESS')
       AND (scheduled_start < $3 AND scheduled_end > $2)`,
    [lawyer_id, startDate.toISOString(), endDate.toISOString()]
  );

  if (conflictCheck.rows.length > 0) {
    res.status(409).json({
      success: false,
      message: 'This slot was just reserved by another client. Please choose an alternate slot.',
    });
    return;
  }

  // Calculate pricing
  const lawyerRes = await query(
    `SELECT consultation_fee_chat, consultation_fee_audio, consultation_fee_video, consultation_fee_offline, platform_commission_rate
     FROM lawyer_profiles WHERE user_id = $1`,
    [lawyer_id]
  );

  const lawyer = lawyerRes.rows[0];
  let baseFee = 999.00;
  if (consultation_mode === 'CHAT') baseFee = parseFloat(lawyer.consultation_fee_chat);
  if (consultation_mode === 'AUDIO') baseFee = parseFloat(lawyer.consultation_fee_audio);
  if (consultation_mode === 'VIDEO') baseFee = parseFloat(lawyer.consultation_fee_video);
  if (consultation_mode === 'OFFLINE') baseFee = parseFloat(lawyer.consultation_fee_offline);

  const platformFee = 99.00;
  const taxAmount = parseFloat(((baseFee + platformFee) * 0.18).toFixed(2));
  const totalAmount = parseFloat((baseFee + platformFee + taxAmount).toFixed(2));
  const commissionRate = parseFloat(lawyer.platform_commission_rate || '15.00');
  const lawyerNetEarnings = parseFloat((baseFee * (1 - commissionRate / 100)).toFixed(2));

  const bookingReference = `LAW-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  // Create appointment
  const apptResult = await query(
    `INSERT INTO appointments (
       booking_reference, client_id, lawyer_id, category_id,
       consultation_mode, status, scheduled_start, scheduled_end,
       client_case_brief, consultation_fee, platform_fee, tax_amount,
       total_amount, lawyer_net_earnings
     ) VALUES ($1, $2, $3, $4, $5, 'CONFIRMED', $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING *`,
    [
      bookingReference, clientId, lawyer_id, category_id,
      consultation_mode, startDate.toISOString(), endDate.toISOString(),
      client_case_brief || 'Standard consultation',
      baseFee, platformFee, taxAmount, totalAmount, lawyerNetEarnings,
    ]
  );

  const appointment = apptResult.rows[0];

  // Initialize Consultation Room
  const agoraChannelName = `room_${appointment.id.replace(/-/g, '').slice(0, 20)}`;
  await query(
    `INSERT INTO consultation_rooms (appointment_id, agora_channel_name)
     VALUES ($1, $2)
     ON CONFLICT (appointment_id) DO NOTHING`,
    [appointment.id, agoraChannelName]
  );

  // Initialize Chat Thread
  await query(
    `INSERT INTO chat_threads (appointment_id, client_id, lawyer_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (appointment_id) DO NOTHING`,
    [appointment.id, clientId, lawyer_id]
  );

  res.json({
    success: true,
    message: 'Appointment successfully booked and confirmed',
    data: {
      appointment,
      agora_channel_name: agoraChannelName,
    },
  });
});

// 3. Get My Consultations (Upcoming / Past)
bookingRouter.get('/my-consultations', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const role = req.user!.role;
  const { status } = req.query;

  const userColumn = role === 'LAWYER' ? 'a.lawyer_id' : 'a.client_id';

  let statusFilter = '';
  if (status === 'upcoming') {
    statusFilter = "AND a.status IN ('CONFIRMED', 'PENDING', 'IN_PROGRESS')";
  } else if (status === 'completed') {
    statusFilter = "AND a.status = 'COMPLETED'";
  } else if (status === 'cancelled') {
    statusFilter = "AND a.status = 'CANCELLED'";
  }

  const result = await query(
    `SELECT a.*,
       lp.full_name AS lawyer_name,
       lp.avatar_url AS lawyer_avatar,
       lp.city AS lawyer_city,
       cp.full_name AS client_name,
       cp.avatar_url AS client_avatar,
       cr.agora_channel_name,
       cr.is_completed AS room_completed
     FROM appointments a
     JOIN lawyer_profiles lp ON a.lawyer_id = lp.user_id
     JOIN client_profiles cp ON a.client_id = cp.user_id
     LEFT JOIN consultation_rooms cr ON a.id = cr.appointment_id
     WHERE ${userColumn} = $1 ${statusFilter}
     ORDER BY a.scheduled_start DESC`,
    [userId]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// 4. Get Consultation Details by ID
bookingRouter.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const result = await query(
    `SELECT a.*,
       lp.full_name AS lawyer_name,
       lp.avatar_url AS lawyer_avatar,
       lp.bar_council_number,
       lp.office_address,
       cp.full_name AS client_name,
       cr.agora_channel_name,
       cr.is_completed AS room_completed,
       cr.actual_duration_seconds
     FROM appointments a
     JOIN lawyer_profiles lp ON a.lawyer_id = lp.user_id
     JOIN client_profiles cp ON a.client_id = cp.user_id
     LEFT JOIN consultation_rooms cr ON a.id = cr.appointment_id
     WHERE a.id = $1 AND (a.client_id = $2 OR a.lawyer_id = $2)`,
    [id, userId]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ success: false, message: 'Appointment not found' });
    return;
  }

  res.json({
    success: true,
    data: result.rows[0],
  });
});
