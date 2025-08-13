import { prisma } from '../lib/prisma.js';
import { AadhaarRe, PANRe, DOBStrRe } from '../validators/regex.js';

function parseDob(dobdoi) {
  if (!DOBStrRe.test(dobdoi || '')) return null;
  const [d, m, y] = dobdoi.split('/').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return isNaN(dt.getTime()) ? null : dt;
}

export async function submit(req, res) {
  try {
    const body = req.body || {};
    const {
      aadhaar,
      nameAsAadhaar,
      aadhaarConsent,
      orgType,
      pan,
      nameAsPerPan,
      dobdoi,
      panConsent,
    } = body;

    if (!AadhaarRe.test(aadhaar || '')) {
      return res.status(400).json({ ok: false, error: 'Invalid Aadhaar' });
    }
    const upPan = String(pan || '').toUpperCase();
    if (!PANRe.test(upPan)) {
      return res.status(400).json({ ok: false, error: 'Invalid PAN' });
    }

    const dobDate = parseDob(dobdoi);

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
        payload: body,
      },
    });

    return res.json({ ok: true, id: created.id, createdAt: created.createdAt });
  } catch (e) {
    console.error('SUBMIT ERROR:', e);
    return res.status(500).json({ ok: false, error: e?.message || 'DB error' });
  }
}
