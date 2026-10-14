import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../../database/index.js';
import { authenticateToken } from '../../common/auth.middleware.js';
import { config } from '../../config/index.js';

export const consultationRouter = Router();

// Join Consultation Room (Generates Agora token / room credentials)
consultationRouter.post('/:id/join', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const apptRes = await query(
    `SELECT a.*, cr.agora_channel_name, cr.started_at
     FROM appointments a
     JOIN consultation_rooms cr ON a.id = cr.appointment_id
     WHERE a.id = $1 AND (a.client_id = $2 OR a.lawyer_id = $2)`,
    [id, userId]
  );

  if (apptRes.rows.length === 0) {
    res.status(404).json({ success: false, message: 'Consultation room not found or unauthorized' });
    return;
  }

  const appointment = apptRes.rows[0];

  // Mark room as started if first participant joins
  if (!appointment.started_at) {
    await query(
      `UPDATE consultation_rooms SET started_at = NOW() WHERE appointment_id = $1`,
      [id]
    );
    await query(
      `UPDATE appointments SET status = 'IN_PROGRESS', updated_at = NOW() WHERE id = $1`,
      [id]
    );
  }

  // Generate Agora dynamic token (mock token for development, production uses agora-access-token)
  const agoraToken = `agora_rtc_token_${appointment.agora_channel_name}_user_${userId.slice(0, 8)}`;

  res.json({
    success: true,
    data: {
      appointment_id: id,
      agora_channel_name: appointment.agora_channel_name,
      agora_app_id: config.agora.appId,
      agora_token: agoraToken,
      uid: Math.floor(100000 + Math.random() * 900000),
      mode: appointment.consultation_mode,
      scheduled_start: appointment.scheduled_start,
      scheduled_end: appointment.scheduled_end,
    },
  });
});

// Complete Consultation Room
const completeConsultationSchema = z.object({
  actual_duration_seconds: z.number().int().min(0).default(1200),
  lawyer_notes: z.string().optional(),
});

consultationRouter.post('/:id/complete', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const { actual_duration_seconds, lawyer_notes } = req.body;

  const apptRes = await query(
    `SELECT * FROM appointments WHERE id = $1 AND (client_id = $2 OR lawyer_id = $2)`,
    [id, userId]
  );

  if (apptRes.rows.length === 0) {
    res.status(404).json({ success: false, message: 'Consultation not found' });
    return;
  }

  await query(
    `UPDATE consultation_rooms
     SET ended_at = NOW(),
         actual_duration_seconds = $2,
         lawyer_notes = $3,
         is_completed = TRUE
     WHERE appointment_id = $1`,
    [id, actual_duration_seconds || 1200, lawyer_notes || '']
  );

  await query(
    `UPDATE appointments
     SET status = 'COMPLETED', updated_at = NOW()
     WHERE id = $1`,
    [id]
  );

  res.json({
    success: true,
    message: 'Consultation marked completed successfully',
  });
});
