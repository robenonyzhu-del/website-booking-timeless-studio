import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import { AuthProvider } from "@/lib/auth-context";
import GlobalFooter from "@/components/GlobalFooter";

export const metadata = {
  title: "Timeless Studio Booking",
  description: "Layanan Jasa Kreatif Self Photo Studio - Pesan jadwal sesi foto Anda secara online.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Timeless Studio Booking',
    description: 'Layanan Jasa Kreatif Self Photo Studio - Pesan jadwal sesi foto Anda secara online.',
    url: '/',
    siteName: 'Timeless Studio',
    images: [
      {
        url: '/logo.jpg', // Gambar yang akan muncul di WhatsApp
        width: 800,
        height: 600,
        alt: 'Timeless Studio Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timeless Studio Booking',
    description: 'Layanan Jasa Kreatif Self Photo Studio - Pesan jadwal sesi foto Anda secara online.',
    images: ['/logo.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="font-sans selection:bg-studio-900 selection:text-white flex flex-col min-h-screen">
        <AuthProvider>
          {children}
          
          <GlobalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
