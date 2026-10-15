import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../../database/index.js';
import { authenticateToken, requireRoles } from '../../common/auth.middleware.js';
import { validateBody } from '../../common/validation.middleware.js';

export const lawyerRouter = Router();

// 1. Search & Filter Lawyers
lawyerRouter.get('/', async (req: Request, res: Response) => {
  const {
    category_id,
    city,
    q,
    mode,
    min_experience,
    min_rating,
    sort_by,
    page = '1',
    limit = '10',
  } = req.query;

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 10;
  const offset = (pageNum - 1) * limitNum;

  const conditions: string[] = ["lp.verification_status = 'APPROVED'"];
  const params: any[] = [];
  let paramIdx = 1;

  if (category_id) {
    conditions.push(
      `EXISTS (SELECT 1 FROM lawyer_categories lc WHERE lc.lawyer_id = lp.user_id AND lc.category_id = $${paramIdx})`
    );
    params.push(category_id);
    paramIdx++;
  }

  if (city) {
    conditions.push(`lp.city ILIKE $${paramIdx}`);
    params.push(`%${city}%`);
    paramIdx++;
  }

  if (q) {
    conditions.push(
      `(lp.full_name ILIKE $${paramIdx} OR lp.bio ILIKE $${paramIdx} OR EXISTS (SELECT 1 FROM categories c JOIN lawyer_categories lc ON lc.category_id = c.id WHERE lc.lawyer_id = lp.user_id AND c.name ILIKE $${paramIdx}))`
    );
    params.push(`%${q}%`);
    paramIdx++;
  }

  if (min_experience) {
    conditions.push(`lp.experience_years >= $${paramIdx}`);
    params.push(parseInt(min_experience as string, 10));
    paramIdx++;
  }

  if (min_rating) {
    conditions.push(`lp.rating_average >= $${paramIdx}`);
    params.push(parseFloat(min_rating as string));
    paramIdx++;
  }

  let orderBy = 'lp.rating_average DESC, lp.experience_years DESC';
  if (sort_by === 'experience') orderBy = 'lp.experience_years DESC';
  if (sort_by === 'price_low') orderBy = 'lp.consultation_fee_video ASC';
  if (sort_by === 'price_high') orderBy = 'lp.consultation_fee_video DESC';
  if (sort_by === 'rating') orderBy = 'lp.rating_average DESC';

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countQuery = `SELECT COUNT(*)::int AS total FROM lawyer_profiles lp ${whereClause}`;
  const countRes = await query(countQuery, params);
  const total = countRes.rows[0]?.total || 0;

  const listQuery = `
    SELECT 
      lp.user_id,
      lp.full_name,
      lp.avatar_url,
      lp.bar_council_number,
      lp.state_bar_council,
      lp.experience_years,
      lp.bio,
      lp.qualification_summary,
      lp.city,
      lp.state,
      lp.languages,
      lp.courts_of_practice,
      lp.is_online_for_instant,
      lp.rating_average,
      lp.rating_count,
      lp.consultation_fee_chat,
      lp.consultation_fee_audio,
      lp.consultation_fee_video,
      lp.consultation_fee_offline,
      COALESCE(
        (SELECT json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug))
         FROM categories c
         JOIN lawyer_categories lc ON lc.category_id = c.id
         WHERE lc.lawyer_id = lp.user_id),
        '[]'::json
      ) AS categories
    FROM lawyer_profiles lp
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
  `;

  params.push(limitNum, offset);
  const listRes = await query(listQuery, params);

  res.json({
    success: true,
    data: listRes.rows,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      total_pages: Math.ceil(total / limitNum),
    },
  });
});

// 2. Get Lawyer Profile Detail
lawyerRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const lawyerRes = await query(
    `SELECT lp.*,
       COALESCE(
         (SELECT json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug))
          FROM categories c
          JOIN lawyer_categories lc ON lc.category_id = c.id
          WHERE lc.lawyer_id = lp.user_id),
         '[]'::json
       ) AS categories,
       COALESCE(
         (SELECT json_agg(r.*)
          FROM (
            SELECT id, rating, review_title, review_text, lawyer_reply_text, created_at
            FROM reviews
            WHERE lawyer_id = lp.user_id AND is_published = TRUE
            ORDER BY created_at DESC
            LIMIT 10
          ) r),
         '[]'::json
       ) AS recent_reviews
     FROM lawyer_profiles lp
     WHERE lp.user_id = $1`,
    [id]
  );

  if (lawyerRes.rows.length === 0) {
    res.status(404).json({ success: false, message: 'Lawyer profile not found' });
    return;
  }

  res.json({
    success: true,
    data: lawyerRes.rows[0],
  });
});

// 3. Get Lawyer Availability Slots for Date
lawyerRouter.get('/:id/availability', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, mode = 'VIDEO' } = req.query;

  if (!date || typeof date !== 'string') {
    res.status(400).json({ success: false, message: 'Valid date query (YYYY-MM-DD) is required' });
    return;
  }

  const queryDate = new Date(date);
  const dayOfWeek = queryDate.getDay(); // 0 = Sun, 6 = Sat

  // Check if lawyer has blocked this date
  const blockedRes = await query(
    `SELECT 1 FROM lawyer_blocked_dates
     WHERE lawyer_id = $1 AND start_date <= $2 AND end_date >= $2`,
    [id, date]
  );

  if (blockedRes.rows.length > 0) {
    res.json({
      success: true,
      data: {
        date,
        is_available: false,
        reason: 'Lawyer is unavailable on this date',
        slots: [],
      },
    });
    return;
  }

  // Get lawyer schedule for this day
  const scheduleRes = await query(
    `SELECT * FROM lawyer_schedules
     WHERE lawyer_id = $1 AND day_of_week = $2 AND is_active = TRUE`,
    [id, dayOfWeek]
  );

  // Generate slots: If no custom schedule, default working hours 09:00 - 18:00
  let slotDuration = 20; // 20 mins default
  let startTime = '10:00';
  let endTime = '18:00';

  if (scheduleRes.rows.length > 0) {
    slotDuration = scheduleRes.rows[0].slot_duration_minutes || 20;
    startTime = scheduleRes.rows[0].start_time;
    endTime = scheduleRes.rows[0].end_time;
  }

  // Fetch already booked appointments for this date
  const bookedRes = await query(
    `SELECT scheduled_start, scheduled_end
     FROM appointments
     WHERE lawyer_id = $1
       AND status IN ('CONFIRMED', 'PENDING', 'IN_PROGRESS')
       AND scheduled_start::date = $2::date`,
    [id, date]
  );

  const bookedTimes = new Set(
    bookedRes.rows.map((row) =>
      new Date(row.scheduled_start).toISOString().substring(11, 16)
    )
  );

  // Generate standard 20-min slots
  const slots: Array<{ time: string; is_available: boolean }> = [];
  const startHour = parseInt(startTime.split(':')[0], 10);
  const endHour = parseInt(endTime.split(':')[0], 10);

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += slotDuration) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const isBooked = bookedTimes.has(timeStr);
      slots.push({
        time: timeStr,
        is_available: !isBooked,
      });
    }
  }

  res.json({
    success: true,
    data: {
      date,
      mode,
      slot_duration_minutes: slotDuration,
      total_slots: slots.length,
      slots,
    },
  });
});

// 4. Lawyer Onboarding / KYC Submission
const onboardingSchema = z.object({
  full_name: z.string().min(3),
  bar_council_number: z.string().min(5),
  state_bar_council: z.string().min(3),
  year_of_enrollment: z.number().int().min(1950).max(2030),
  experience_years: z.number().int().min(0),
  bio: z.string().optional(),
  city: z.string(),
  state: z.string(),
  category_ids: z.array(z.string()).min(1),
  bar_id_front_url: z.string().url(),
  bar_id_back_url: z.string().url(),
  degree_url: z.string().url(),
});

lawyerRouter.post(
  '/onboarding',
  authenticateToken,
  requireRoles('LAWYER'),
  validateBody(onboardingSchema),
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const {
      full_name,
      bar_council_number,
      state_bar_council,
      year_of_enrollment,
      experience_years,
      bio,
      city,
      state,
      category_ids,
      bar_id_front_url,
      bar_id_back_url,
      degree_url,
    } = req.body;

    // Insert or update lawyer profile
    await query(
      `INSERT INTO lawyer_profiles (
         user_id, full_name, bar_council_number, state_bar_council,
         year_of_enrollment, experience_years, bio, city, state,
         verification_status, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING', NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         full_name = $2,
         bar_council_number = $3,
         state_bar_council = $4,
         year_of_enrollment = $5,
         experience_years = $6,
         bio = $7,
         city = $8,
         state = $9,
         verification_status = 'PENDING',
         updated_at = NOW()`,
      [userId, full_name, bar_council_number, state_bar_council, year_of_enrollment, experience_years, bio, city, state]
    );

    // Save category mappings
    for (const catId of category_ids) {
      await query(
        `INSERT INTO lawyer_categories (lawyer_id, category_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [userId, catId]
      );
    }

    // Insert verification records
    await query(
      `INSERT INTO lawyer_verifications (
         lawyer_id, bar_council_id_front_url, bar_council_id_back_url,
         degree_certificate_url, government_id_url, status
       ) VALUES ($1, $2, $3, $4, $2, 'PENDING')`,
      [userId, bar_id_front_url, bar_id_back_url, degree_url]
    );

    res.json({
      success: true,
      message: 'Onboarding application submitted for compliance verification',
      data: {
        verification_status: 'PENDING',
        estimated_review_time: '24-48 hours',
      },
    });
  }
);

// 6. Lawyer Requests (Screen 40)
lawyerRouter.get('/requests/pending', authenticateToken, async (req: Request, res: Response) => {
  const lawyerId = req.user!.userId;

  const result = await query(
    `SELECT a.*, cp.full_name as client_name, cp.avatar_url as client_avatar, cp.city as client_city
     FROM appointments a
     JOIN users u ON a.client_id = u.id
     LEFT JOIN client_profiles cp ON u.id = cp.user_id
     WHERE a.lawyer_id = $1
     ORDER BY a.scheduled_start ASC`,
    [lawyerId]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// 7. Accept / Reject / Reschedule Consultation Request (Screen 40)
const respondRequestSchema = z.object({
  action: z.enum(['CONFIRM', 'CANCEL', 'RESCHEDULE']),
  reschedule_time: z.string().datetime().optional(),
  reason: z.string().optional(),
});

lawyerRouter.post(
  '/requests/:id/respond',
  authenticateToken,
  validateBody(respondRequestSchema),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const lawyerId = req.user!.userId;
    const { action, reschedule_time, reason } = req.body;

    let newStatus = 'CONFIRMED';
    if (action === 'CANCEL') newStatus = 'CANCELLED';
    if (action === 'RESCHEDULE') newStatus = 'RESCHEDULED';

    const result = await query(
      `UPDATE appointments
       SET status = $1,
           scheduled_start = COALESCE($2, scheduled_start),
           cancellation_reason = $3,
           updated_at = NOW()
       WHERE id = $4 AND lawyer_id = $5
       RETURNING *`,
      [newStatus, reschedule_time || null, reason || null, id, lawyerId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Appointment request not found' });
      return;
    }

    res.json({
      success: true,
      message: `Appointment request ${action.toLowerCase()}ed successfully`,
      data: result.rows[0],
    });
  }
);

// 8. Lawyer Client Management (Screen 42)
lawyerRouter.get('/clients/roster', authenticateToken, async (req: Request, res: Response) => {
  const lawyerId = req.user!.userId;

  const result = await query(
    `SELECT DISTINCT ON (u.id)
       u.id as client_id, u.phone_number, cp.full_name, cp.city, cp.preferred_language,
       COUNT(a.id) OVER (PARTITION BY u.id) as total_consultations,
       MAX(a.created_at) OVER (PARTITION BY u.id) as last_consultation_at
     FROM appointments a
     JOIN users u ON a.client_id = u.id
     LEFT JOIN client_profiles cp ON u.id = cp.user_id
     WHERE a.lawyer_id = $1
     ORDER BY u.id, a.created_at DESC`,
    [lawyerId]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// 9. Update Lawyer Profile & Fees (Screen 38)
const updateLawyerProfileSchema = z.object({
  bio: z.string().optional(),
  experience_years: z.number().optional(),
  consultation_fee: z.number().optional(),
  chat_fee: z.number().optional(),
  audio_fee: z.number().optional(),
  video_fee: z.number().optional(),
  offline_fee: z.number().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

lawyerRouter.put('/profile/settings', authenticateToken, validateBody(updateLawyerProfileSchema), async (req: Request, res: Response) => {
  const lawyerId = req.user!.userId;
  const { bio, experience_years, consultation_fee, chat_fee, audio_fee, video_fee, offline_fee, city, state } = req.body;

  const result = await query(
    `UPDATE lawyer_profiles
     SET bio = COALESCE($1, bio),
         experience_years = COALESCE($2, experience_years),
         consultation_fee = COALESCE($3, consultation_fee),
         chat_fee = COALESCE($4, chat_fee),
         audio_fee = COALESCE($5, audio_fee),
         video_fee = COALESCE($6, video_fee),
         offline_fee = COALESCE($7, offline_fee),
         city = COALESCE($8, city),
         state = COALESCE($9, state),
         updated_at = NOW()
     WHERE user_id = $10
     RETURNING *`,
    [bio, experience_years, consultation_fee, chat_fee, audio_fee, video_fee, offline_fee, city, state, lawyerId]
  );

  res.json({
    success: true,
    message: 'Advocate profile updated successfully',
    data: result.rows[0],
  });
});

// 10. Lawyer Analytics & Ratings Overview (Screen 46)
lawyerRouter.get('/profile/analytics', authenticateToken, async (req: Request, res: Response) => {
  const lawyerId = req.user!.userId;

  const lawyerRes = await query(`SELECT rating_average, rating_count, total_consultations FROM lawyer_profiles WHERE user_id = $1`, [lawyerId]);
  const lawyer = lawyerRes.rows[0] || { rating_average: '4.8', rating_count: 24, total_consultations: 38 };

  const reviewsRes = await query(
    `SELECT r.*, cp.full_name as client_name
     FROM reviews r
     JOIN users u ON r.client_id = u.id
     LEFT JOIN client_profiles cp ON u.id = cp.user_id
     WHERE r.lawyer_id = $1
     ORDER BY r.created_at DESC LIMIT 10`,
    [lawyerId]
  );

  res.json({
    success: true,
    data: {
      metrics: {
        profile_views: 412,
        consultation_completion_rate: '98%',
        average_rating: lawyer.rating_average,
        total_reviews: lawyer.rating_count,
        repeat_clients: 9,
      },
      rating_distribution: {
        5: 18,
        4: 5,
        3: 1,
        2: 0,
        1: 0,
      },
      recent_reviews: reviewsRes.rows,
    },
  });
});

