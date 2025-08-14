import { Router } from 'express';
import { sendOtp, verifyOtp } from '../controllers/otpController.js';
// Routes for Otp
export const otpRouter = Router();
otpRouter.post('/send', sendOtp);
otpRouter.post('/verify', verifyOtp);
