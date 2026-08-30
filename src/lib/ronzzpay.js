import axios from 'axios';

const API_KEY = process.env.RONZZPAY_API_KEY;

const apiClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const ronzzpayConfig = {
  sandboxCreateUrl: 'https://pg.ronzzyt.id/api/transaction/create',
  sandboxStatusUrl: 'https://pg.ronzzyt.id/api/transaction/status',
};

/**
 * Buat transaksi sandbox (QRIS/e-wallet).
 * @param {string} code - Kode pembayaran: 'qris', 'dana', 'ovo', 'gopay', dll
 * @param {number} amount - Jumlah pembayaran (Rp)
 * @param {string} [description] - Catatan/deskripsi pesanan
 * @param {string} [webhookUrl] - URL webhook untuk notifikasi
 */
export async function createTransaction(code, amount, description, webhookUrl) {
  if (!API_KEY) throw new Error('RONZZPAY_API_KEY is not defined in environment variables');

  const payload = {
    api_key: API_KEY,
    code,
    amount,
  };

  if (description) payload.description = description;
  if (webhookUrl) payload.webhook_url = webhookUrl;

  const response = await apiClient.post(ronzzpayConfig.sandboxCreateUrl, payload);
  return response.data;
}

/**
 * Cek status transaksi sandbox.
 * @param {string} reffId - Reference ID dari create transaction
 */
export async function getTransactionStatus(reffId) {
  if (!API_KEY) throw new Error('RONZZPAY_API_KEY is not defined in environment variables');

  const response = await apiClient.post(ronzzpayConfig.sandboxStatusUrl, {
    api_key: API_KEY,
    reff_id: reffId,
  });
  return response.data;
}

import crypto from 'crypto';

/**
 * Verifikasi webhook signature menggunakan timing-safe comparison.
 * @param {string|Buffer} rawBody - Raw JSON body
 * @param {string} signatureHeader - Nilai header X-Signature
 * @returns {boolean} true jika signature valid
 */
export function verifySignature(rawBody, signatureHeader) {
  if (!signatureHeader || !rawBody || !API_KEY) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', API_KEY)
    .update(rawBody)
    .digest('hex');

  try {
    const sigBuffer = Buffer.from(signatureHeader, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}
