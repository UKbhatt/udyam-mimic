import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const prisma = new PrismaClient();

const AadhaarRe = /^[0-9]{12}$/;
const OTPRe = /^[0-9]{6}$/;
const PANRe = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/api/otp/send', (req, res) => {
  const { aadhaar } = req.body || {};
  if (!AadhaarRe.test(aadhaar || '')) {
    return res.status(400).json({ ok: false, error: 'Invalid Aadhaar' });
  }
  return res.json({ ok: true, sent: true, hint: 'Use OTP 123456' });
});

app.post('/api/otp/verify', (req, res) => {
  const { aadhaar, otp } = req.body || {};
  if (!AadhaarRe.test(aadhaar || '') || !OTPRe.test(otp || '')) {
    return res.status(400).json({ ok: false, error: 'Invalid payload' });
  }
  if (otp !== '123456') {
    return res.status(400).json({ ok: false, error: 'Wrong OTP' });
  }
  return res.json({ ok: true, verified: true });
});
app.post('/api/submit', async (req, res) => {
  try {
    const body = req.body || {};
    const {
      aadhaar,
      nameAsAadhaar,
      orgType,
      pan,
      nameAsPerPan,
      dobdoi,            
      aadhaarConsent,  
      panConsent         
    } = body;

    if (!AadhaarRe.test(aadhaar || '')) {
      return res.status(400).json({ ok: false, error: 'Invalid Aadhaar' });
    }
    const upPan = String(pan || '').toUpperCase();
    if (!PANRe.test(upPan)) {
      return res.status(400).json({ ok: false, error: 'Invalid PAN' });
    }

    let dobDate = null;
    if (dobdoi && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dobdoi)) {
      const [d, m, y] = dobdoi.split('/').map(Number);
      dobDate = new Date(Date.UTC(y, m - 1, d));
      if (isNaN(dobDate.getTime())) dobDate = null;
    }

    const created = await prisma.submission.create({
      data: {
        aadhaar,
        nameAsAadhaar: nameAsAadhaar || null,
        aadhaarConsent: Boolean(aadhaarConsent),
        otpVerified: true,              

        orgType: orgType || null,
        pan: upPan,
        nameAsPerPan: nameAsPerPan || null,
        dobdoiRaw: dobdoi || null,
        dobdoi: dobDate,               
        panConsent: Boolean(panConsent),

        sourceIP: req.ip || null,
        payload: body                   
      }
    });

    return res.json({
      ok: true,
      id: created.id,
      createdAt: created.createdAt
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'DB error' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on :${port}`));
