import nodemailer from 'nodemailer';

export async function sendCustomerNotification(bookingData) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn("EMAIL_USER atau EMAIL_PASS tidak disetel di .env.local. Notifikasi email tidak dikirim.");
    return;
  }

  // Jika pelanggan tidak memasukkan email asli (guest), jangan kirim
  if (!bookingData.email || bookingData.email === "guest@example.com") {
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    const mailOptions = {
      from: `"Timeless Studio" <${emailUser}>`,
      to: bookingData.email, // Kirim ke email pelanggan
      subject: `[LUNAS] E-Ticket Pesanan: ${bookingData.kodeBooking}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #18181b; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Pembayaran Berhasil!</h2>
          </div>
          <div style="padding: 20px; background-color: #f9fafb;">
            <p>Halo <strong>${bookingData.namaPelanggan || 'Pelanggan'}</strong>,</p>
            <p>Terima kasih! Pembayaran untuk pesanan dengan kode <strong>${bookingData.kodeBooking}</strong> telah berhasil kami terima.</p>
            
            <h3 style="border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Detail E-Ticket Anda</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #52525b;">Kode Booking:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #18181b;">${bookingData.kodeBooking}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #52525b;">Tanggal Booking:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${bookingData.tanggal || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #52525b;">Jam Mulai:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${bookingData.jamMulai || '-'}</td>
              </tr>
              ${bookingData.addons && bookingData.addons.length > 0 ? `
              <tr>
                <td colspan="2" style="padding: 12px 0 4px 0; color: #52525b; border-top: 1px solid #eaeaea; font-size: 12px; text-transform: uppercase; font-weight: bold;">Layanan Tambahan (Add-ons):</td>
              </tr>
              ${bookingData.addons.map(addon => `
              <tr>
                <td style="padding: 4px 0; color: #52525b; font-size: 13px;">${addon.qty}x ${addon.namaLayanan}</td>
                <td style="padding: 4px 0; text-align: right; font-size: 13px;">Rp ${(addon.hargaSatuan * addon.qty).toLocaleString('id-ID')}</td>
              </tr>
              `).join('')}
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #52525b; border-top: 1px solid #eaeaea;">Total Dibayar:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #16a34a; border-top: 1px solid #eaeaea;">${formatCurrency(bookingData.totalHarga || 0)}</td>
              </tr>
            </table>
            
            <div style="margin-top: 30px; text-align: center;">
              <p style="color: #71717a; font-size: 14px; margin-bottom: 20px;">Silakan tunjukkan E-Ticket ini (atau halaman History di website) kepada petugas kami saat Anda tiba di studio.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/history" style="background-color: #18181b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Lihat Tiket Saya</a>
            </div>
          </div>
          <div style="background-color: #eaeaea; color: #71717a; padding: 10px; text-align: center; font-size: 12px;">
            Harap datang 10 menit sebelum jadwal Anda dimulai. Email ini dibuat secara otomatis.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Notifikasi pelanggan berhasil dikirim ke %s: %s", bookingData.email, info.messageId);
  } catch (error) {
    console.error("Gagal mengirim notifikasi email pelanggan:", error);
  }
}
