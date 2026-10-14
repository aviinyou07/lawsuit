import { Router, Request, Response } from 'express';
import { query } from '../../database/index.js';

export const categoryRouter = Router();

// 1. Get all legal categories with specializations
categoryRouter.get('/', async (_req: Request, res: Response) => {
  const categoriesRes = await query(
    `SELECT c.*, 
       COALESCE(
         (SELECT json_agg(s.*) FROM specializations s WHERE s.category_id = c.id),
         '[]'::json
       ) AS specializations,
       (SELECT COUNT(*)::int FROM lawyer_categories lc WHERE lc.category_id = c.id) AS lawyer_count
     FROM categories c
     WHERE c.is_active = TRUE
     ORDER BY c.display_order ASC`
  );

  res.json({
    success: true,
    data: categoriesRes.rows,
  });
});

// 2. Get specializations for a category
categoryRouter.get('/:id/specializations', async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await query(
    'SELECT * FROM specializations WHERE category_id = $1 ORDER BY name ASC',
    [id]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});
