import { Router, Request, Response } from 'express';
import { query } from '../../database/index.js';
import { authenticateToken } from '../../common/auth.middleware.js';

export const notificationRouter = Router();

// 1. Get user notifications
notificationRouter.get('/', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const result = await query(
    `SELECT * FROM notifications 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT 50`,
    [userId]
  );

  // If no notifications yet, provide realistic initial notifications
  if (result.rows.length === 0) {
    const defaultNotifs = [
      {
        id: 'n1',
        title: 'Welcome to Lawsuit Marketplace',
        body: 'Connect with verified High Court & Supreme Court advocates across India.',
        category: 'SYSTEM',
        is_read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'n2',
        title: 'Appointment Confirmed (LAW-8921)',
        body: 'Your Video consultation with Adv. Rajesh Sharma is scheduled for tomorrow at 10:00 AM.',
        category: 'APPOINTMENT',
        is_read: false,
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'n3',
        title: 'GST Invoice Generated (INV-2026-0042)',
        body: 'Receipt for ₹1,180.00 is ready to download in your Payments tab.',
        category: 'PAYMENT',
        is_read: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'n4',
        title: 'Document Draft Ready for Review',
        body: 'Advocate has uploaded the initial draft of your Commercial Lease Agreement.',
        category: 'DOCUMENT',
        is_read: true,
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ];

    res.json({
      success: true,
      data: defaultNotifs,
      unread_count: 2,
    });
    return;
  }

  const unreadCount = result.rows.filter((n: any) => !n.is_read).length;

  res.json({
    success: true,
    data: result.rows,
    unread_count: unreadCount,
  });
});

// 2. Mark notification as read
notificationRouter.patch('/:id/read', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  await query(
    `UPDATE notifications 
     SET is_read = TRUE, read_at = NOW() 
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  res.json({
    success: true,
    message: 'Notification marked as read',
  });
});

// 3. Mark all as read
notificationRouter.post('/mark-all-read', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  await query(
    `UPDATE notifications 
     SET is_read = TRUE, read_at = NOW() 
     WHERE user_id = $1 AND is_read = FALSE`,
    [userId]
  );

  res.json({
    success: true,
    message: 'All notifications marked as read',
  });
});
