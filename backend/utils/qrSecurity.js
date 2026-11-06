const crypto = require('crypto');

const SECRET_KEY = process.env.QR_SECRET_KEY || 'kiosk_secure_rotating_token_secret_8888';
const ROTATION_SECONDS = parseInt(process.env.QR_ROTATION_INTERVAL_SECONDS || '20', 10);
const GRACE_PERIOD_SECONDS = 15; // 15s grace for network latency

/**
 * Generate a dynamic signed QR payload for Kiosk Entrance Screen
 */
function generateDynamicQrPayload() {
  const now = Date.now();
  const expiresAt = now + (ROTATION_SECONDS * 1000);
  const nonce = crypto.randomBytes(6).toString('hex');
  const payloadToSign = `ATT_KIOSK:${now}:${expiresAt}:${nonce}`;
  
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payloadToSign)
    .digest('hex')
    .substring(0, 16);

  const qrData = JSON.stringify({
    type: 'CAMPUS_ATTENDANCE_DYNAMIC_QR',
    ts: now,
    exp: expiresAt,
    n: nonce,
    sig: signature,
  });

  return {
    qrData,
    expiresAt,
    ttlSeconds: ROTATION_SECONDS,
  };
}

/**
 * Verify scanned QR payload authenticity and expiration
 */
function verifyDynamicQrPayload(rawPayload) {
  try {
    let parsed;
    if (typeof rawPayload === 'string') {
      parsed = JSON.parse(rawPayload);
    } else {
      parsed = rawPayload;
    }

    if (parsed.type !== 'CAMPUS_ATTENDANCE_DYNAMIC_QR' || !parsed.ts || !parsed.exp || !parsed.sig || !parsed.n) {
      return { valid: false, error: 'ទម្រង់ QR Code មិនត្រឹមត្រូវ (Invalid QR format)' };
    }

    const payloadToSign = `ATT_KIOSK:${parsed.ts}:${parsed.exp}:${parsed.n}`;
    const expectedSig = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payloadToSign)
      .digest('hex')
      .substring(0, 16);

    if (parsed.sig !== expectedSig) {
      return { valid: false, error: 'QR Code ក្លែងក្លាយ ឬគ្មានសុពលភាព (Invalid QR signature)' };
    }

    const now = Date.now();
    // Allow up to GRACE_PERIOD_SECONDS after expiry for slow phone internet
    if (now > parsed.exp + (GRACE_PERIOD_SECONDS * 1000)) {
      return {
        valid: false,
        error: 'QR Code ហួសសុពលភាពហើយ! សូម Scan កូដថ្មីនៅលើ Screen មាត់ទ្វារ (QR Code has expired)',
      };
    }

    return { valid: true, payload: parsed };
  } catch (err) {
    return { valid: false, error: 'មិនអាចផ្ទៀងផ្ទាត់ QR Code បានទេ: ' + err.message };
  }
}

module.exports = {
  generateDynamicQrPayload,
  verifyDynamicQrPayload,
  ROTATION_SECONDS,
};

