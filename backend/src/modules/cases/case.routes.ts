import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../../database/index.js';
import { authenticateToken } from '../../common/auth.middleware.js';
import { validateBody } from '../../common/validation.middleware.js';

export const caseRouter = Router();

const createCaseSchema = z.object({
  case_title: z.string().min(3),
  court_name: z.string().min(3),
  case_type: z.string().min(2),
  cnr_number: z.string().optional(),
  petitioner_name: z.string().optional(),
  respondent_name: z.string().optional(),
  lawyer_id: z.string().uuid(),
  filing_date: z.string().optional(),
  next_hearing_date: z.string().optional(),
  notes: z.string().optional(),
});

// 1. Get Cases List
caseRouter.get('/', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const role = req.user!.role;
  const userCol = role === 'LAWYER' ? 'lawyer_id' : 'client_id';

  const result = await query(
    `SELECT c.*,
       lp.full_name AS lawyer_name,
       cp.full_name AS client_name
     FROM cases c
     JOIN lawyer_profiles lp ON c.lawyer_id = lp.user_id
     JOIN client_profiles cp ON c.client_id = cp.user_id
     WHERE c.${userCol} = $1
     ORDER BY c.next_hearing_date ASC NULLS LAST, c.created_at DESC`,
    [userId]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// 2. Get Case Details
caseRouter.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const caseRes = await query(
    `SELECT c.*,
       lp.full_name AS lawyer_name,
       cp.full_name AS client_name,
       COALESCE(
         (SELECT json_agg(ch.* ORDER BY ch.hearing_date DESC)
          FROM case_hearings ch WHERE ch.case_id = c.id),
         '[]'::json
       ) AS hearings
     FROM cases c
     JOIN lawyer_profiles lp ON c.lawyer_id = lp.user_id
     JOIN client_profiles cp ON c.client_id = cp.user_id
     WHERE c.id = $1 AND (c.client_id = $2 OR c.lawyer_id = $2)`,
    [id, userId]
  );

  if (caseRes.rows.length === 0) {
    res.status(404).json({ success: false, message: 'Case not found' });
    return;
  }

  res.json({
    success: true,
    data: caseRes.rows[0],
  });
});

// 3. Create Case
caseRouter.post('/', authenticateToken, validateBody(createCaseSchema), async (req: Request, res: Response) => {
  const clientId = req.user!.userId;
  const {
    case_title, court_name, case_type, cnr_number,
    petitioner_name, respondent_name, lawyer_id,
    filing_date, next_hearing_date, notes
  } = req.body;

  const insertRes = await query(
    `INSERT INTO cases (
       client_id, lawyer_id, case_title, court_name, case_type,
       cnr_number, petitioner_name, respondent_name,
       filing_date, next_hearing_date, notes
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      clientId, lawyer_id, case_title, court_name, case_type,
      cnr_number || null, petitioner_name || null, respondent_name || null,
      filing_date || null, next_hearing_date || null, notes || null
    ]
  );

  res.json({
    success: true,
    message: 'Case record created successfully',
    data: insertRes.rows[0],
  });
});
