import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../../database/index.js';
import { authenticateToken } from '../../common/auth.middleware.js';
import { validateBody } from '../../common/validation.middleware.js';

export const reviewRouter = Router();

const createReviewSchema = z.object({
  appointment_id: z.string().min(10),
  rating: z.number().int().min(1).max(5),
  review_title: z.string().max(150).optional(),
  review_text: z.string().max(1000).optional(),
});

// Submit Review for Consultation
reviewRouter.post('/', authenticateToken, validateBody(createReviewSchema), async (req: Request, res: Response) => {
  const clientId = req.user!.userId;
  const { appointment_id, rating, review_title, review_text } = req.body;

  const apptRes = await query(
    `SELECT * FROM appointments WHERE id = $1 AND client_id = $2`,
    [appointment_id, clientId]
  );

  if (apptRes.rows.length === 0) {
    res.status(404).json({ success: false, message: 'Consultation appointment not found' });
    return;
  }

  const appointment = apptRes.rows[0];

  const reviewRes = await query(
    `INSERT INTO reviews (appointment_id, client_id, lawyer_id, rating, review_title, review_text)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (appointment_id) DO UPDATE SET
       rating = $4,
       review_title = $5,
       review_text = $6
     RETURNING *`,
    [appointment_id, clientId, appointment.lawyer_id, rating, review_title || null, review_text || null]
  );

  // Recalculate lawyer rating average
  const aggRes = await query(
    `SELECT AVG(rating)::numeric(3,2) as avg_rating, COUNT(*)::int as total_reviews
     FROM reviews WHERE lawyer_id = $1 AND is_published = TRUE`,
    [appointment.lawyer_id]
  );

  if (aggRes.rows.length > 0) {
    await query(
      `UPDATE lawyer_profiles
       SET rating_average = $1, rating_count = $2, updated_at = NOW()
       WHERE user_id = $3`,
      [aggRes.rows[0].avg_rating, aggRes.rows[0].total_reviews, appointment.lawyer_id]
    );
  }

  res.json({
    success: true,
    message: 'Review recorded successfully. Thank you for your feedback.',
    data: reviewRes.rows[0],
  });
});

// Get Reviews for Lawyer
reviewRouter.get('/lawyer/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await query(
    `SELECT r.*, cp.full_name as client_name, cp.avatar_url as client_avatar
     FROM reviews r
     JOIN client_profiles cp ON r.client_id = cp.user_id
     WHERE r.lawyer_id = $1 AND r.is_published = TRUE
     ORDER BY r.created_at DESC`,
    [id]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});
