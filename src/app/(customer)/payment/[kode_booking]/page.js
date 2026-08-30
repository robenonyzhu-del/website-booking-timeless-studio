"use client";

import { useAuth } from "@/lib/auth-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function PaymentPage() {
  const { kode_booking } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (kode_booking) {
      // Listen to booking changes for real-time payment status update
      const q = query(collection(db, "bookings"), where("kodeBooking", "==", kode_booking));
      const unsub = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setBooking({ id: docSnap.id, ...docSnap.data() });
        }
      });

      // Poll status every 5 seconds since webhook won't work on localhost
      const intervalId = setInterval(async () => {
        try {
          const res = await fetch("/api/payment/check-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kode_booking }),
          });
          const data = await res.json();
          // If status changes to dibayar, onSnapshot above will also catch it
          // but we rely on the API to trigger the Firestore update.
        } catch (error) {
          console.error("Failed to poll status:", error);
        }
      }, 5000);

      return () => {
        unsub();
        clearInterval(intervalId);
      };
    }
  }, [user, loading, router, kode_booking]);

  const handlePay = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kode_booking, payment_method: paymentMethod })
      });
      
      const result = await res.json();
      if (result.success) {
        setPaymentData(result.data);
      } else {
        setErrorMessage(result.message || "Gagal memproses pembayaran");
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan sistem. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user || !booking) return <div className="p-12 text-center min-h-[calc(100vh-72px)] text-studio-500">Memuat detail pembayaran...</div>;

  const totalAmount = booking.totalHarga || 0;

  // Jika sudah dibayar
  if (booking.status === "dibayar") {
    return (
      <>
        <Navbar />
        <section className="flex-col p-6 lg:p-12 bg-white min-h-[calc(100vh-72px)] flex items-center justify-center">
            <div className="max-w-md w-full bg-studio-50 p-12 text-center border border-studio-200 rounded-sm">
                <i className="fa-regular fa-circle-check text-5xl text-studio-900 mb-6 block"></i>
                <h2 className="text-2xl font-serif font-semibold text-studio-900 mb-2">Pembayaran Berhasil</h2>
                <p className="text-studio-600 text-sm mb-8">Pembayaran Anda telah dikonfirmasi secara otomatis oleh sistem.</p>
                <Link href="/history" className="btn-primary w-full py-4 rounded-sm text-sm font-medium tracking-wide block uppercase">
                    Lihat Tiket Booking
                </Link>
            </div>
        </section>
      </>
    );
  }

  // Jika sedang menunggu pembayaran QRIS
  if (paymentData) {
    return (
      <>
        <Navbar />
        <section className="flex-col p-6 lg:p-12 bg-white min-h-[calc(100vh-72px)] flex items-center justify-center">
            <div className="max-w-md w-full bg-studio-50 p-12 text-center border border-studio-200 rounded-sm shadow-sm">
                <h2 className="text-xl font-serif font-semibold text-studio-900 mb-2">Selesaikan Pembayaran</h2>
                <p className="text-studio-500 text-sm mb-8">Silakan scan QR Code atau gunakan tautan pembayaran di bawah ini.</p>
                
                {paymentData.code === 'qris' && paymentData.qr_image ? (
                  <div className="flex justify-center mb-6 bg-white p-4 rounded-lg inline-block border border-studio-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={paymentData.qr_image} alt="QR Code Pembayaran" className="w-48 h-48 object-contain" />
                  </div>
                ) : null}

                {paymentData.code === 'dana' && paymentData.payment_number ? (
                  <div className="mb-6 text-left bg-studio-100 p-4 rounded-md">
                    <p className="text-sm font-semibold text-studio-900 mb-1">Nomor Pembayaran DANA:</p>
                    <p className="text-xl font-mono font-bold text-studio-900 mb-4">{paymentData.payment_number}</p>
                    <p className="text-sm font-semibold text-studio-900 mb-1">Instruksi:</p>
                    <pre className="text-xs text-studio-600 whitespace-pre-wrap font-sans">
                      {paymentData.instructions}
                    </pre>
                  </div>
                ) : null}

                <div className="text-3xl font-bold text-studio-900 mb-6">
                  Rp {(paymentData.amount || totalAmount).toLocaleString('id-ID')}
                </div>
                
                {paymentData.checkout_url && (
                  <a 
                    href={paymentData.checkout_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary w-full py-3 rounded-sm text-sm font-medium tracking-wide block uppercase mb-4"
                  >
                    Buka Link Pembayaran
                  </a>
                )}
                
                <p className="text-xs text-studio-400">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Menunggu konfirmasi otomatis...
                </p>
            </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="flex-col p-6 lg:p-12 bg-white min-h-[calc(100vh-72px)]">
          <div className="max-w-2xl mx-auto w-full space-y-8 pt-8">
              <div className="border-b border-studio-200 pb-6 text-center">
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-studio-500">Langkah Terakhir</span>
                  <h2 className="text-3xl font-serif font-semibold text-studio-900 mt-2">Pembayaran Online</h2>
                  <p className="mt-2 text-sm text-studio-600">Kode Booking: <span className="font-semibold text-studio-900">{kode_booking}</span></p>
              </div>

              <div className="bg-studio-50 p-8 border border-studio-200 rounded-sm space-y-6 text-center">
                  <p className="text-sm font-medium text-studio-500 uppercase tracking-widest mb-2">Total Tagihan</p>
                  <h3 className="text-3xl font-medium text-studio-900 mb-1">Rp {totalAmount.toLocaleString('id-ID')}</h3>
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-200 text-center">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4 pt-4">
                  <label className="block text-xs font-medium uppercase tracking-wider text-studio-500 mb-2">Pilih Metode Pembayaran</label>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button 
                      onClick={() => setPaymentMethod("qris")}
                      className={`p-4 border rounded-md flex items-center justify-center gap-2 transition ${paymentMethod === "qris" ? "border-studio-900 bg-studio-900 text-white" : "border-studio-200 bg-white text-studio-600 hover:border-studio-400"}`}
                    >
                      <i className="fa-solid fa-qrcode"></i> QRIS
                    </button>
                    <button 
                      onClick={() => setPaymentMethod("dana")}
                      className={`p-4 border rounded-md flex items-center justify-center gap-2 transition ${paymentMethod === "dana" ? "border-studio-900 bg-studio-900 text-white" : "border-studio-200 bg-white text-studio-600 hover:border-studio-400"}`}
                    >
                      <i className="fa-solid fa-wallet"></i> DANA
                    </button>
                  </div>
                  
                  <button onClick={handlePay} disabled={isSubmitting} className="btn-primary w-full py-4 rounded-sm text-sm font-medium tracking-wide uppercase disabled:opacity-50 mt-4">
                      {isSubmitting ? "Memproses..." : "Bayar Sekarang"}
                  </button>
              </div>
          </div>
      </section>
    </>
  );
}
