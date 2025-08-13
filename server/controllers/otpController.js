import { AadhaarRe, OTPRe } from '../validators/regex.js';

export function sendOtp(req, res) {
  const { aadhaar } = req.body || {};
  if (!AadhaarRe.test(aadhaar || '')) {
    return res.status(400).json({ ok: false, error: 'Invalid Aadhaar' });
  }
  return res.json({ ok: true, sent: true, hint: 'Use OTP 123456' });
}

export function verifyOtp(req, res) {
  const { aadhaar, otp } = req.body || {};
  if (!AadhaarRe.test(aadhaar || '') || !OTPRe.test(otp || '')) {
    return res.status(400).json({ ok: false, error: 'Invalid payload' });
  }
  if (otp !== '123456') {
    return res.status(400).json({ ok: false, error: 'Wrong OTP' });
  }
  return res.json({ ok: true, verified: true });
}
