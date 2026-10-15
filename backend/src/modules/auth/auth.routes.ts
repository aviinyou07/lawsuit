import { Router, Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { query } from '../../database/index.js';
import { config } from '../../config/index.js';
import { validateBody } from '../../common/validation.middleware.js';
import { authenticateToken, AuthUser } from '../../common/auth.middleware.js';

export const authRouter = Router();

// In-memory OTP storage for development (falls back from Redis)
const otpStore = new Map<string, { otp: string; expiresAt: number; role: string }>();

const sendOtpSchema = z.object({
  phone_country_code: z.string().default('+91'),
  phone_number: z.string().min(10).max(15),
  role: z.enum(['CLIENT', 'LAWYER', 'ADMIN', 'SUPPORT']).default('CLIENT'),
});

const verifyOtpSchema = z.object({
  phone_country_code: z.string().default('+91'),
  phone_number: z.string().min(10).max(15),
  otp: z.string().length(6),
});

const refreshTokenSchema = z.object({
  refresh_token: z.string(),
});

// 1. Send OTP
authRouter.post('/send-otp', validateBody(sendOtpSchema), async (req: Request, res: Response) => {
  const { phone_country_code, phone_number, role } = req.body;
  const fullPhone = `${phone_country_code}${phone_number}`;

  // In development, default test OTP is 123456
  const isDev = config.nodeEnv !== 'production';
  const otp = isDev ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(fullPhone, {
    otp,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    role,
  });

  if (isDev) {
    console.log('\n╔═════════════════════════════════════════════════════════════╗');
    console.log(`║ 📱 [DEV MODE OTP DISPATCHED]                                ║`);
    console.log(`║ Mobile Number : ${fullPhone.padEnd(44)}║`);
    console.log(`║ Target Role   : ${role.padEnd(44)}║`);
    console.log(`║ 🔑 YOUR OTP   : >>> ${otp} <<<                            ║`);
    console.log('╚═════════════════════════════════════════════════════════════╝\n');
  }

  res.json({
    success: true,
    message: 'OTP dispatched successfully',
    data: {
      phone_number,
      expires_in_seconds: 900,
      ...(isDev && { dev_otp: otp }),
    },
  });
});

// 2. Verify OTP & Issue Tokens
authRouter.post('/verify-otp', validateBody(verifyOtpSchema), async (req: Request, res: Response) => {
  const { phone_country_code, phone_number, otp } = req.body;
  const fullPhone = `${phone_country_code}${phone_number}`;

  const stored = otpStore.get(fullPhone);
  const isDev = config.nodeEnv !== 'production';

  // In dev mode, allow '123456', stored otp, or any 6-digit code to prevent testing blockers
  const isValidOtp = isDev
    ? (otp === '123456' || otp === stored?.otp || /^\d{6}$/.test(otp))
    : (stored && stored.otp === otp && Date.now() < stored.expiresAt);

  if (isDev) {
    console.log(`\n🔐 [DEV MODE OTP VERIFY] Number: ${fullPhone} | Submitted OTP: ${otp} | Result: ${isValidOtp ? 'VALID ✅' : 'INVALID ❌'}\n`);
  }

  if (!isValidOtp) {
    res.status(400).json({
      success: false,
      message: 'Invalid or expired OTP',
    });
    return;
  }

  const requestedRole = stored ? stored.role : 'CLIENT';
  otpStore.delete(fullPhone);

  // Check or create user in PostgreSQL
  let userResult = await query(
    'SELECT * FROM users WHERE phone_number = $1',
    [phone_number]
  );

  let user = userResult.rows[0];

  if (!user) {
    const insertResult = await query(
      `INSERT INTO users (phone_country_code, phone_number, role, is_phone_verified)
       VALUES ($1, $2, $3, TRUE)
       RETURNING *`,
      [phone_country_code, phone_number, requestedRole]
    );
    user = insertResult.rows[0];
  } else if (requestedRole === 'LAWYER' && user.role !== 'LAWYER') {
    // Switch role to LAWYER if logging in via Advocate portal
    await query('UPDATE users SET role = $1 WHERE id = $2', ['LAWYER', user.id]);
    user.role = 'LAWYER';
  }

  // Ensure profiles & wallets exist
  if (user.role === 'CLIENT') {
    await query(
      `INSERT INTO client_profiles (user_id, full_name)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO NOTHING`,
      [user.id, 'Client User']
    );
  } else if (user.role === 'LAWYER') {
    await query(
      `INSERT INTO lawyer_profiles (
         user_id, full_name, bar_council_number, state_bar_council,
         year_of_enrollment, experience_years, bio, city, state,
         verification_status, is_online_for_instant, rating_average, rating_count,
         consultation_fee_chat, consultation_fee_audio, consultation_fee_video, consultation_fee_offline
       ) VALUES ($1, $2, $3, 'Bar Council of Delhi', 2012, 12, $4, 'New Delhi', 'Delhi', 'APPROVED', TRUE, 4.90, 38, 499.00, 799.00, 1199.00, 2499.00)
       ON CONFLICT (user_id) DO NOTHING`,
      [
        user.id,
        phone_number === '9888888888' ? 'Adv. Rajesh Sharma' : 'Adv. Counsel',
        'D/' + phone_number.slice(-4) + '/2012',
        'Senior Advocate practicing before the High Court of Delhi and Supreme Court. Specialized in civil litigation, property disputes, and corporate compliance.'
      ]
    );

    await query(
      `INSERT INTO lawyer_wallets (lawyer_id, available_balance, escrow_locked_balance, total_withdrawn)
       VALUES ($1, 14900.00, 2400.00, 85000.00)
       ON CONFLICT (lawyer_id) DO NOTHING`,
      [user.id]
    );
  }

  // Generate Tokens
  const tokenPayload: AuthUser = {
    userId: user.id,
    role: user.role,
    phoneNumber: user.phone_number,
  };

  const accessToken = jwt.sign(tokenPayload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  });

  const refreshToken = jwt.sign(tokenPayload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });

  res.json({
    success: true,
    message: 'Authentication successful',
    data: {
      user: {
        id: user.id,
        phone_number: user.phone_number,
        role: user.role,
        is_phone_verified: user.is_phone_verified,
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: config.jwt.expiresIn,
      },
    },
  });
});

// 3. Refresh Token
authRouter.post('/refresh-token', validateBody(refreshTokenSchema), (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  try {
    const decoded = jwt.verify(refresh_token, config.jwt.refreshSecret) as AuthUser;
    const tokenPayload: AuthUser = {
      userId: decoded.userId,
      role: decoded.role,
      phoneNumber: decoded.phoneNumber,
    };

    const newAccessToken = jwt.sign(tokenPayload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    });

    res.json({
      success: true,
      message: 'Token refreshed',
      data: {
        access_token: newAccessToken,
        token_type: 'Bearer',
        expires_in: config.jwt.expiresIn,
      },
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
});

// 4. Get Current User Profile (Me)
authRouter.get('/me', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const userRes = await query('SELECT id, phone_country_code, phone_number, email, role, is_active FROM users WHERE id = $1', [userId]);
  if (userRes.rows.length === 0) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  const user = userRes.rows[0];
  let profile = null;

  if (user.role === 'CLIENT') {
    const pRes = await query('SELECT * FROM client_profiles WHERE user_id = $1', [userId]);
    profile = pRes.rows[0] || null;
  } else if (user.role === 'LAWYER') {
    const pRes = await query('SELECT * FROM lawyer_profiles WHERE user_id = $1', [userId]);
    profile = pRes.rows[0] || null;
  }

  res.json({
    success: true,
    data: {
      user,
      profile,
    },
  });
});
