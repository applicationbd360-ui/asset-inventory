import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/error.middleware';
import { auditLog } from './middleware/audit.middleware';
import router from './routes';
import { initCronJobs } from './utils/cron';

// Initialize background jobs
initCronJobs();

const app = express();

// ── Security ─────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        config.app.frontendUrl,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:5173',
      ];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Rate Limiting ────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { success: false, error: { message: 'Too many requests, please try again later' } },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ── Body Parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Logging ──────────────────────────────────────────────────
if (config.app.nodeEnv !== 'test') {
  app.use(morgan(config.app.nodeEnv === 'development' ? 'dev' : 'combined'));
}

// ── Static Files ─────────────────────────────────────────────
app.use('/uploads', express.static(config.storage.uploadDir));

// ── Audit Log Middleware ──────────────────────────────────────
app.use('/api', auditLog);

// ── Health Check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AssetIQ API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ── API Routes ───────────────────────────────────────────────
app.use(config.app.apiPrefix, router);

// ── 404 Handler ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { message: 'Route not found', code: 'NOT_FOUND' } });
});

// ── Error Handler ────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────
const server = app.listen(config.app.port, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║         AssetIQ API Server Started           ║
  ║  Port:  ${config.app.port}                              ║
  ║  Mode:  ${config.app.nodeEnv.padEnd(36)}║
  ║  API:   http://localhost:${config.app.port}${config.app.apiPrefix}   ║
  ╚══════════════════════════════════════════════╝
  `);
});

// ── Graceful Shutdown ─────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
