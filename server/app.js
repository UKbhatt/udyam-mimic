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

  app.use('/health', healthRouter); // health route
  app.use('/api/otp', otpRouter); // otp route
  app.use('/api/submit', submissionRouter); // submission route

  app.use(errorHandler); ; // error-Handling route

  return app;
}
