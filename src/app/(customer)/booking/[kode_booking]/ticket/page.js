"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TicketPage() {
  const { kode_booking } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-12 text-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-center text-white">
          <svg className="w-16 h-16 mx-auto text-indigo-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold">Booking Berhasil!</h2>
          <p className="text-indigo-200 mt-2">Sesi foto Anda telah diamankan sementara.</p>
        </div>
        
        <div className="p-8 text-center space-y-6">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-widest">Kode Booking</p>
            <p className="text-4xl font-black text-gray-900 mt-1">{kode_booking}</p>
          </div>
          
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm">
            <p className="font-semibold mb-1">Menunggu Pembayaran</p>
            <p>Silakan selesaikan pembayaran untuk mengkonfirmasi pesanan ini secara permanen.</p>
          </div>
          
          <div className="pt-4">
            <Link 
              href={`/payment/${kode_booking}`}
              className="block w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Lanjutkan ke Pembayaran
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
