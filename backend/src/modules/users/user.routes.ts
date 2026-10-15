import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../../database/index.js';
import { authenticateToken } from '../../common/auth.middleware.js';
import { validateBody } from '../../common/validation.middleware.js';

export const userRouter = Router();

const updateProfileSchema = z.object({
  full_name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  avatar_url: z.string().url().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  preferred_language: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Get User Profile
userRouter.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const result = await query(
    `SELECT u.id, u.phone_number, u.email, u.role, cp.*
     FROM users u
     LEFT JOIN client_profiles cp ON u.id = cp.user_id
     WHERE u.id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ success: false, message: 'Profile not found' });
    return;
  }

  res.json({
    success: true,
    data: result.rows[0],
  });
});

// Update User Profile
userRouter.put('/profile', authenticateToken, validateBody(updateProfileSchema), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { full_name, email, avatar_url, city, state, pincode, preferred_language, latitude, longitude } = req.body;

  if (email) {
    await query('UPDATE users SET email = $1, updated_at = NOW() WHERE id = $2', [email, userId]);
  }

  const updateResult = await query(
    `INSERT INTO client_profiles (user_id, full_name, avatar_url, city, state, pincode, preferred_language, latitude, longitude, updated_at)
     VALUES ($1, COALESCE($2, 'User'), $3, $4, $5, $6, COALESCE($7, 'English'), $8, $9, NOW())
     ON CONFLICT (user_id) DO UPDATE SET
       full_name = COALESCE($2, client_profiles.full_name),
       avatar_url = COALESCE($3, client_profiles.avatar_url),
       city = COALESCE($4, client_profiles.city),
       state = COALESCE($5, client_profiles.state),
       pincode = COALESCE($6, client_profiles.pincode),
       preferred_language = COALESCE($7, client_profiles.preferred_language),
       latitude = COALESCE($8, client_profiles.latitude),
       longitude = COALESCE($9, client_profiles.longitude),
       updated_at = NOW()
     RETURNING *`,
    [userId, full_name, avatar_url, city, state, pincode, preferred_language, latitude, longitude]
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: updateResult.rows[0],
  });
});

// 3. Get User Shortlisted Lawyers (Screen 12)
userRouter.get('/shortlist', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const result = await query(
    `SELECT lp.*, s.created_at as shortlisted_at
     FROM user_shortlists s
     JOIN lawyer_profiles lp ON s.lawyer_id = lp.user_id
     WHERE s.user_id = $1
     ORDER BY s.created_at DESC`,
    [userId]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// 4. Toggle Shortlist / Bookmark Lawyer (Screen 12)
userRouter.post('/shortlist/:lawyerId', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { lawyerId } = req.params;

  const existing = await query(
    'SELECT 1 FROM user_shortlists WHERE user_id = $1 AND lawyer_id = $2',
    [userId, lawyerId]
  );

  if (existing.rows.length > 0) {
    await query('DELETE FROM user_shortlists WHERE user_id = $1 AND lawyer_id = $2', [userId, lawyerId]);
    res.json({
      success: true,
      is_shortlisted: false,
      message: 'Lawyer removed from shortlist',
    });
  } else {
    await query('INSERT INTO user_shortlists (user_id, lawyer_id) VALUES ($1, $2)', [userId, lawyerId]);
    res.json({
      success: true,
      is_shortlisted: true,
      message: 'Lawyer added to shortlist',
    });
  }
});

