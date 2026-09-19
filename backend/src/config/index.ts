import dotenv from 'dotenv';
dotenv.config();

export const config = {
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000'),
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    companyName: process.env.COMPANY_NAME || 'AssetIQ',
    currency: process.env.CURRENCY || 'BDT',
  },
  db: {
    url: process.env.DATABASE_URL || '',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'fallback-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  storage: {
    type: process.env.STORAGE_TYPE || 'local',
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },
  email: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'AssetIQ <noreply@assetiq.com>',
  },
  fiscalYear: {
    startMonth: parseInt(process.env.FISCAL_YEAR_START_MONTH || '7'),
  },
};

export const isDev = config.app.nodeEnv === 'development';
export const isProd = config.app.nodeEnv === 'production';
