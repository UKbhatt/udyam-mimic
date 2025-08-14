import { AadhaarRe, OTPRe } from '../validators/regex.js';

// Handle sending OTP request
export function sendOtp(req, res) {
  const { aadhaar } = req.body || {};

  // Validate Aadhaar number format
  if (!AadhaarRe.test(aadhaar || '')) {
    return res.status(400).json({ ok: false, error: 'Invalid Aadhaar' });
  }
  // Return success response with OTP hint
  return res.json({ ok: true, sent: true, hint: 'Use OTP 123456' });
}

// Handle OTP verification request
export function verifyOtp(req, res) {
  const { aadhaar, otp } = req.body || {};

  // Validate Aadhaar and OTP format
  if (!AadhaarRe.test(aadhaar || '') || !OTPRe.test(otp || '')) {
    return res.status(400).json({ ok: false, error: 'Invalid payload' });
  }

  // Check if OTP matches the expected value
  if (otp !== '123456') {
    return res.status(400).json({ ok: false, error: 'Wrong OTP' });
  }

  // Return success if verified
  return res.json({ ok: true, verified: true });
}
