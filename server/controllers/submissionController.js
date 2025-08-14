import { prisma } from '../lib/prisma.js';
import { AadhaarRe, PANRe, DOBStrRe } from '../validators/regex.js';

// Parse DOB string in format "DD/MM/YYYY" to a Date object
function parseDob(dobdoi) {
  // Check if format is valid
  if (!DOBStrRe.test(dobdoi || '')) return null;
  
  // Split into day, month, year and convert to numbers
  const [d, m, y] = dobdoi.split('/').map(Number);
  
  // Create UTC date
  const dt = new Date(Date.UTC(y, m - 1, d));
  
  // Return null if invalid date
  return isNaN(dt.getTime()) ? null : dt;
}

// Handle form submission
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

    // Validate Aadhaar format
    if (!AadhaarRe.test(aadhaar || '')) {
      return res.status(400).json({ ok: false, error: 'Invalid Aadhaar' });
    }

    // Convert PAN to uppercase and validate format
    const upPan = String(pan || '').toUpperCase();
    if (!PANRe.test(upPan)) {
      return res.status(400).json({ ok: false, error: 'Invalid PAN' });
    }

    // Parse DOB string to Date
    const dobDate = parseDob(dobdoi);

    // Insert submission into database
    const created = await prisma.submission.create({
      data: {
        aadhaar,
        nameAsAadhaar: nameAsAadhaar || null,
        aadhaarConsent: Boolean(aadhaarConsent),
        otpVerified: true, //  OTP already verified

        orgType: orgType || null,
        pan: upPan,
        nameAsPerPan: nameAsPerPan || null,
        dobdoiRaw: dobdoi || null,
        dobdoi: dobDate,
        panConsent: Boolean(panConsent),

        sourceIP: req.ip || null,
        payload: body, // Store full request payload
      },
    });

    // Respond with success and record info
    return res.json({ ok: true, id: created.id, createdAt: created.createdAt });
  } catch (e) {
    // Log error and respond with server error
    console.error('SUBMIT ERROR:', e);
    return res.status(500).json({ ok: false, error: e?.message || 'DB error' });
  }
}
