import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../../database/index.js';
import { authenticateToken, requireRoles } from '../../common/auth.middleware.js';
import { validateBody } from '../../common/validation.middleware.js';

export const disputeRouter = Router();

const createDisputeSchema = z.object({
  appointment_id: z.string().uuid().optional(),
  document_order_id: z.string().uuid().optional(),
  issue_type: z.string().min(3),
  description: z.string().min(10),
});

// 1. Raise Grievance / Ticket (Screen 35)
disputeRouter.post('/', authenticateToken, validateBody(createDisputeSchema), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { appointment_id, document_order_id, issue_type, description } = req.body;
  const disputeRef = `DISP-${Math.floor(100000 + Math.random() * 900000)}`;

  const result = await query(
    `INSERT INTO disputes (dispute_reference, raised_by_user_id, appointment_id, document_order_id, issue_type, description, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'OPEN')
     RETURNING *`,
    [disputeRef, userId, appointment_id || null, document_order_id || null, issue_type, description]
  );

  res.status(201).json({
    success: true,
    message: 'Support ticket raised successfully. Our legal ops team will review within 24 hours.',
    data: result.rows[0],
  });
});

// 2. List User Disputes
disputeRouter.get('/', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const result = await query(
    `SELECT d.*, a.booking_reference
     FROM disputes d
     LEFT JOIN appointments a ON d.appointment_id = a.id
     WHERE d.raised_by_user_id = $1
     ORDER BY d.created_at DESC`,
    [userId]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// 3. Admin: List All Disputes (Screen 55)
disputeRouter.get('/admin/all', authenticateToken, requireRoles('ADMIN'), async (_req: Request, res: Response) => {
  const result = await query(
    `SELECT d.*, u.phone_number as client_phone, cp.full_name as client_name
     FROM disputes d
     JOIN users u ON d.raised_by_user_id = u.id
     LEFT JOIN client_profiles cp ON u.id = cp.user_id
     ORDER BY d.created_at DESC`
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// 4. Admin: Resolve Dispute (Screen 55)
const resolveDisputeSchema = z.object({
  status: z.enum(['RESOLVED_REFUNDED', 'RESOLVED_REJECTED', 'CLOSED']),
  refund_amount: z.number().optional(),
  resolution_notes: z.string().min(5),
});

disputeRouter.post('/:id/resolve', authenticateToken, requireRoles('ADMIN'), validateBody(resolveDisputeSchema), async (req: Request, res: Response) => {
  const { id } = req.params;
  const adminId = req.user!.userId;
  const { status, refund_amount, resolution_notes } = req.body;

  const result = await query(
    `UPDATE disputes
     SET status = $1, refund_amount = $2, admin_resolution_notes = $3, resolved_by = $4, updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [status, refund_amount || 0, resolution_notes, adminId, id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ success: false, message: 'Dispute record not found' });
    return;
  }

  res.json({
    success: true,
    message: 'Dispute resolved successfully',
    data: result.rows[0],
  });
});
