# Timeless Studio Booking System

Website booking modern yang dibangun khusus untuk **Timeless Self Photo Studio**. Project ini menggunakan arsitektur *serverless* dengan stack Next.js (App Router) dan Firebase. 

Sistem ini sudah menangani seluruh *flow* bisnis studio secara otomatis: mulai dari pemilihan paket, pemilihan jadwal kosong, pembayaran otomatis (*payment gateway*), hingga pengiriman struk via email.

## Tech Stack Utama
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** Firebase Firestore
- **Payment Gateway:** RonzzPay (QRIS & DANA)
- **Email Service:** Nodemailer (via Gmail SMTP)
- **Hosting (Rekomendasi):** Vercel

## Fitur Kunci
- **Smart Booking System:** Mencegah *double-booking* (bentrok jadwal) secara *real-time* dengan memanipulasi slot ketersediaan di Firestore.
- **Automated Payment Gateway:** Terintegrasi dengan RonzzPay untuk pembayaran otomatis (QRIS dinamis dan E-Wallet). Status lunas langsung di-update via Webhook & Polling.
- **E-Ticket & Add-ons:** Pelanggan mendapatkan struk digital yang mencatat paket utama serta layanan tambahan (*add-ons*). Sistem otomatis mengirimkan struk ke email pelanggan.
- **Admin Dashboard:** Panel *back-office* khusus untuk mengatur paket, layanan tambahan, mengunci jadwal, dan memantau transaksi.

## Instalasi & Pengembangan Lokal

1. **Clone repository ini**
   ```bash
   git clone https://github.com/robenonyzhu-del/website-booking-timeless-studio
   cd website-booking-timeless-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Siapkan Environment Variables (.env.local)**
   Buat file `.env.local` di *root directory* dan isi dengan parameter berikut:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyDgBWKUECR94nyTemi2PUDoSucDi2WVhss"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="timeless-studio-booking.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="timeless-studio-booking"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="timeless-studio-booking.firebasestorage.app"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="98723895742"
   NEXT_PUBLIC_FIREBASE_APP_ID="1:98723895742:web:b8d40b698d06397d9601ef"
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-Y69PBB2JKL"

   RONZZPAY_API_KEY="RP-2f9faa19-4f3b-4945-bcbd-a806b803775c"

   # Untuk pengiriman email otomatis ke pelanggan
   EMAIL_USER="roben.onyzhu@gmail.com"
   EMAIL_PASS="xfrdjbqktjcwzaxt"
   ```

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser Anda.

## Panduan Deployment (Production)

Project ini **diwajibkan** untuk di-deploy ke **Vercel**. Hal ini dikarenakan Vercel menyediakan eksekusi *API Routes* (Node.js) secara gratis yang mutlak dibutuhkan untuk menerima *Webhook* dari *Payment Gateway* dan mengeksekusi pengiriman Email.

1. Login ke [Vercel](https://vercel.com/) dan pilih **Add New Project**.
2. Hubungkan repository GitHub ini (klik *Import*).
3. Buka menu **Environment Variables** di Vercel, lalu *copy-paste* semua isi file `.env.local` Anda ke sana.
4. Klik **Deploy** dan tunggu 1-2 menit hingga selesai.
5. (Sangat Penting): *Update* URL Webhook di dashboard admin RonzzPay Anda menggunakan domain Vercel yang baru agar pembayaran otomatis berfungsi.

---
*Developed with clean code and modern web standards.*
