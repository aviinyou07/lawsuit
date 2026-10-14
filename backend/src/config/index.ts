import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lawsuit_db',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwt: {
    secret: process.env.JWT_SECRET || 'lawsuit_super_secret_jwt_key_2026_secure',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'lawsuit_super_secret_refresh_key_2026_secure',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  agora: {
    appId: process.env.AGORA_APP_ID || 'mock_agora_app_id_for_dev',
    appCertificate: process.env.AGORA_APP_CERTIFICATE || 'mock_agora_app_certificate_for_dev',
  },
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
