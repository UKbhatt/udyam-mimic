import express from 'express';
import cors from 'cors';
import { CORS_OPTIONS } from './config/env.js';
import { otpRouter } from './routes/optRoutes.js';
import { submissionRouter } from './routes/submissonRoutes.js';
import { healthRouter } from './routes/healthRoutes.js';
import { errorHandler } from './middlewares/error.js';

export function buildApp() {
  const app = express();

  app.use(cors(CORS_OPTIONS));
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/api/otp', otpRouter);
  app.use('/api/submit', submissionRouter);

  app.use(errorHandler);

  return app;
}
