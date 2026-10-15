import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../../database/index.js';
import { authenticateToken } from '../../common/auth.middleware.js';
import { validateBody } from '../../common/validation.middleware.js';

export const paymentRouter = Router();

const applyCouponSchema = z.object({
  coupon_code: z.string().trim().min(3),
  total_amount: z.number().positive(),
});

// 1. Validate & Apply Coupon Code
paymentRouter.post('/apply-coupon', authenticateToken, validateBody(applyCouponSchema), (req: Request, res: Response) => {
  const { coupon_code, total_amount } = req.body;
  const upperCode = coupon_code.toUpperCase();

  let discount = 0;
  let message = 'Coupon applied successfully!';

  if (upperCode === 'LAWSUIT100' || upperCode === 'DEMOFREE') {
    discount = total_amount;
    message = '🎉 100% Developer Demo discount applied!';
  } else if (upperCode === 'FIRSTLEGAL') {
    discount = Math.round(total_amount * 0.2); // 20% off
    message = '🎉 First Consultation 20% discount applied!';
  } else if (upperCode === 'JUSTICE500') {
    discount = Math.min(500, total_amount);
    message = '🎉 Flat ₹500 discount applied!';
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid or expired coupon code. Try: LAW100, FIRSTLEGAL, or DEMOFREE',
    });
    return;
  }

  const finalAmount = Math.max(0, total_amount - discount);

  res.json({
    success: true,
    message,
    data: {
      coupon_code: upperCode,
      original_amount: total_amount,
      discount_amount: discount,
      final_payable: finalAmount,
    },
  });
});

// 2. Transaction & Invoices History (Screen 33)
paymentRouter.get('/history', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const result = await query(
    `SELECT p.*, a.booking_reference, a.consultation_mode, lp.full_name as lawyer_name
     FROM payments p
     LEFT JOIN appointments a ON p.appointment_id = a.id
     LEFT JOIN lawyer_profiles lp ON a.lawyer_id = lp.user_id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC`,
    [userId]
  );

  if (result.rows.length === 0) {
    // Provide sample invoices for immediate UI review
    const sampleInvoices = [
      {
        id: 'pay-001',
        invoice_number: 'INV-2026-0891',
        transaction_reference: 'TXN-9982-12405',
        service_type: 'Video Consultation (45 Mins)',
        lawyer_name: 'Adv. Rajesh Sharma',
        amount: '1180.00',
        platform_fee: '99.00',
        gst_amount: '180.00',
        status: 'SUCCESS',
        payment_method: 'UPI (Google Pay)',
        sac_code: '998211',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'pay-002',
        invoice_number: 'INV-2026-0740',
        transaction_reference: 'TXN-9982-11389',
        service_type: 'Rent Agreement Drafting & Review',
        lawyer_name: 'Adv. Priya Malhotra',
        amount: '1499.00',
        platform_fee: '150.00',
        gst_amount: '228.00',
        status: 'SUCCESS',
        payment_method: 'HDFC Netbanking',
        sac_code: '998211',
        created_at: new Date(Date.now() - 345600000).toISOString(),
      },
    ];

    res.json({
      success: true,
      data: sampleInvoices,
    });
    return;
  }

  res.json({
    success: true,
    data: result.rows,
  });
});
