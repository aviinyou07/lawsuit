import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../../database/index.js';
import { authenticateToken, requireRoles } from '../../common/auth.middleware.js';
import { validateBody } from '../../common/validation.middleware.js';

export const adminRouter = Router();

// 1. Admin Dashboard KPI Metrics
adminRouter.get('/dashboard/metrics', authenticateToken, requireRoles('ADMIN'), async (_req: Request, res: Response) => {
  const usersCountRes = await query(`SELECT COUNT(*)::int as count FROM users WHERE role = 'CLIENT'`);
  const lawyersCountRes = await query(`SELECT COUNT(*)::int as count FROM lawyer_profiles WHERE verification_status = 'APPROVED'`);
  const pendingKycRes = await query(`SELECT COUNT(*)::int as count FROM lawyer_verifications WHERE status = 'PENDING'`);
  const consultationsCountRes = await query(`SELECT COUNT(*)::int as count FROM appointments`);
  const gmvRes = await query(`SELECT COALESCE(SUM(total_amount), 0)::numeric(12,2) as gmv FROM appointments WHERE status != 'CANCELLED'`);
  const netRevenueRes = await query(`SELECT COALESCE(SUM(platform_fee + (consultation_fee * 0.15)), 0)::numeric(12,2) as net_revenue FROM appointments WHERE status != 'CANCELLED'`);

  res.json({
    success: true,
    data: {
      total_clients: usersCountRes.rows[0].count,
      verified_lawyers: lawyersCountRes.rows[0].count,
      pending_kyc_applications: pendingKycRes.rows[0].count,
      total_consultations: consultationsCountRes.rows[0].count,
      gross_merchandise_value: gmvRes.rows[0].gmv,
      platform_net_revenue: netRevenueRes.rows[0].net_revenue,
    },
  });
});

// 2. Pending Lawyer KYC Queue
adminRouter.get('/lawyer-verifications', authenticateToken, requireRoles('ADMIN'), async (_req: Request, res: Response) => {
  const result = await query(
    `SELECT lv.*, lp.full_name, lp.bar_council_number, lp.state_bar_council, lp.city, lp.experience_years
     FROM lawyer_verifications lv
     JOIN lawyer_profiles lp ON lv.lawyer_id = lp.user_id
     ORDER BY lv.submitted_at ASC`
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// 3. KYC Approval / Rejection Decision
const decisionSchema = z.object({
  decision: z.enum(['APPROVED', 'REJECTED']),
  rejection_reason: z.string().optional(),
  admin_notes: z.string().optional(),
});

adminRouter.post(
  '/lawyer-verifications/:id/decision',
  authenticateToken,
  requireRoles('ADMIN'),
  validateBody(decisionSchema),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const adminId = req.user!.userId;
    const { decision, rejection_reason, admin_notes } = req.body;

    const vRes = await query('SELECT lawyer_id FROM lawyer_verifications WHERE id = $1', [id]);
    if (vRes.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Verification record not found' });
      return;
    }

    const lawyerId = vRes.rows[0].lawyer_id;

    await query(
      `UPDATE lawyer_verifications
       SET status = $1,
           reviewed_at = NOW(),
           reviewed_by = $2,
           rejection_reason = $3,
           admin_internal_notes = $4
       WHERE id = $5`,
      [decision, adminId, rejection_reason || null, admin_notes || null, id]
    );

    await query(
      `UPDATE lawyer_profiles
       SET verification_status = $1, updated_at = NOW()
       WHERE user_id = $2`,
      [decision, lawyerId]
    );

    // Record in audit log
    await query(
      `INSERT INTO audit_logs (actor_id, actor_role, action, target_entity, target_entity_id, after_state)
       VALUES ($1, 'ADMIN', $2, 'LAWYER_VERIFICATION', $3, $4)`,
      [adminId, `KYC_${decision}`, id, JSON.stringify({ status: decision, rejection_reason })]
    );

    res.json({
      success: true,
      message: `Lawyer application successfully marked as ${decision}`,
    });
  }
);
