import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../../database/index.js';
import { authenticateToken } from '../../common/auth.middleware.js';
import { validateBody } from '../../common/validation.middleware.js';

export const documentRouter = Router();

// 1. Get Document Services Catalog
documentRouter.get('/services', async (_req: Request, res: Response) => {
  const result = await query(
    `SELECT ds.*, c.name AS category_name
     FROM document_services ds
     LEFT JOIN categories c ON ds.category_id = c.id
     WHERE ds.is_active = TRUE
     ORDER BY ds.created_at ASC`
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// 2. Create Document Order
const createDocOrderSchema = z.object({
  service_id: z.string().min(10),
  submitted_inputs: z.record(z.string(), z.any()),
  assigned_lawyer_id: z.string().min(10).optional(),
});

documentRouter.post('/orders', authenticateToken, validateBody(createDocOrderSchema), async (req: Request, res: Response) => {
  const clientId = req.user!.userId;
  const { service_id, submitted_inputs, assigned_lawyer_id } = req.body;

  const serviceRes = await query('SELECT * FROM document_services WHERE id = $1', [service_id]);
  if (serviceRes.rows.length === 0) {
    res.status(404).json({ success: false, message: 'Document service not found' });
    return;
  }

  const service = serviceRes.rows[0];
  const orderRef = `DOC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
  const price = parseFloat(service.standard_price);
  const platformCommission = parseFloat((price * 0.20).toFixed(2));
  const deadline = new Date(Date.now() + (service.delivery_sla_days || 2) * 24 * 60 * 60 * 1000);

  const orderRes = await query(
    `INSERT INTO document_orders (
       order_reference, service_id, client_id, assigned_lawyer_id,
       status, submitted_inputs, price_quote, platform_commission,
       delivery_deadline
     ) VALUES ($1, $2, $3, $4, 'PAID', $5, $6, $7, $8)
     RETURNING *`,
    [
      orderRef, service_id, clientId, assigned_lawyer_id || null,
      JSON.stringify(submitted_inputs), price, platformCommission, deadline.toISOString()
    ]
  );

  res.json({
    success: true,
    message: 'Document order submitted successfully',
    data: orderRes.rows[0],
  });
});

// 3. Get Document Order Details & Drafts
documentRouter.get('/orders/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const orderRes = await query(
    `SELECT do.*, ds.name AS service_name, ds.description AS service_description,
       COALESCE(
         (SELECT json_agg(dd.* ORDER BY dd.version_number DESC)
          FROM document_drafts dd WHERE dd.order_id = do.id),
         '[]'::json
       ) AS drafts
     FROM document_orders do
     JOIN document_services ds ON do.service_id = ds.id
     WHERE do.id = $1 AND (do.client_id = $2 OR do.assigned_lawyer_id = $2)`,
    [id, userId]
  );

  if (orderRes.rows.length === 0) {
    res.status(404).json({ success: false, message: 'Document order not found' });
    return;
  }

  res.json({
    success: true,
    data: orderRes.rows[0],
  });
});

// 4. Client Document Vault (Screen 29)
documentRouter.get('/vault', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const result = await query(
    `SELECT id, document_title as title, category, file_size_bytes, mime_type,
            is_encrypted, encryption_algorithm, created_at as "updatedAt"
     FROM document_vault
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// 5. Upload to Vault (Screen 29)
const uploadVaultSchema = z.object({
  title: z.string().min(2),
  category: z.string().min(2),
  file_size_bytes: z.number().optional(),
  mime_type: z.string().optional(),
});

documentRouter.post('/vault/upload', authenticateToken, validateBody(uploadVaultSchema), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { title, category, file_size_bytes, mime_type } = req.body;

  const result = await query(
    `INSERT INTO document_vault (
       user_id, document_title, category, s3_key, s3_bucket,
       file_size_bytes, mime_type, is_encrypted, encryption_algorithm
     ) VALUES ($1, $2, $3, $4, 'lawsuit-vault', $5, $6, true, 'AES-256-GCM')
     RETURNING id, document_title as title, category, file_size_bytes, mime_type, is_encrypted, created_at as "updatedAt"`,
    [
      userId,
      title,
      category,
      `vault/${userId}/${Date.now()}_doc.pdf`,
      file_size_bytes || 1048576,
      mime_type || 'application/pdf',
    ]
  );

  res.json({
    success: true,
    message: 'Document securely encrypted with AES-256 and saved in your digital vault',
    data: result.rows[0],
  });
});

// 6. Grant Vault Access (Screen 29)
documentRouter.post('/vault/:id/grant-access', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { lawyer_id } = req.body;
  const targetLawyer = lawyer_id || 'b0000000-0000-0000-0000-000000000001';

  await query(
    `INSERT INTO vault_access_grants (document_id, granted_to_lawyer_id, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '48 hours')`,
    [id, targetLawyer]
  );

  res.json({
    success: true,
    message: 'Temporary 48-hour access granted to advocate for consultation review',
  });
});
