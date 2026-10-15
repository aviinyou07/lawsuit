import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { userRouter } from './modules/users/user.routes.js';
import { categoryRouter } from './modules/categories/category.routes.js';
import { lawyerRouter } from './modules/lawyers/lawyer.routes.js';
import { bookingRouter } from './modules/bookings/booking.routes.js';
import { consultationRouter } from './modules/consultations/consultation.routes.js';
import { documentRouter } from './modules/documents/document.routes.js';
import { caseRouter } from './modules/cases/case.routes.js';
import { triageRouter } from './modules/triage/triage.routes.js';
import { reviewRouter } from './modules/reviews/review.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminRouter } from './modules/admin/admin.routes.js';
import { notificationRouter } from './modules/notifications/notification.routes.js';
import { paymentRouter } from './modules/payments/payment.routes.js';
import { disputeRouter } from './modules/disputes/dispute.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Security and utility middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Web Admin Console Portal
app.use('/admin', express.static(path.join(__dirname, '../public/admin')));

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'lawsuit-backend-api',
  });
});

// API v1 Routes Mounting
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/lawyers', lawyerRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/consultations', consultationRouter);
app.use('/api/v1/documents', documentRouter);
app.use('/api/v1/cases', caseRouter);
app.use('/api/v1/triage', triageRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/disputes', disputeRouter);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});
