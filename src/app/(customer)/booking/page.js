"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPackages, getAdditionalServices, getSchedules, checkVoucherKode } from "@/lib/data";
import { createBookingAction } from "@/app/admin/actions";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

function BookingFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const initialPaketId = searchParams.get("paket");

  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking State
  const [selectedPaket, setSelectedPaket] = useState(null);
  const [selectedServices, setSelectedServices] = useState({}); // { id_layanan: jumlah }
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState("");
  
  // User Form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
       setEmail(user.email);
       setName(user.email.split("@")[0]);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadInitialData() {
      const [pkgs, svcs] = await Promise.all([getPackages(), getAdditionalServices()]);
      setPackages(pkgs);
      setServices(svcs);
      if (initialPaketId) {
        const pkg = pkgs.find(p => String(p.id_paket) === String(initialPaketId) || String(p.id) === String(initialPaketId));
        setSelectedPaket(pkg || pkgs[0]);
      } else {
        setSelectedPaket(pkgs[0]);
      }
      setLoading(false);
    }
    loadInitialData();
  }, [initialPaketId]);

  // Helper to refresh available slots
  const refreshSchedules = useCallback(async () => {
    if (selectedDate) {
      const data = await getSchedules(selectedDate);
      const available = data.filter(s => s.statusSlot === "tersedia");
      setSchedules(available);
      // If the currently selected schedule got booked by someone else, deselect it
      if (selectedSchedule) {
        const stillAvailable = available.find(s => s.id === selectedSchedule.id);
        if (!stillAvailable) {
          setSelectedSchedule(null);
        }
      }
    } else {
      setSchedules([]);
    }
  }, [selectedDate, selectedSchedule]);

  // Initial fetch + real-time listener for bookings on the selected date
  useEffect(() => {
    if (!selectedDate) {
      setSchedules([]);
      return;
    }

    // Initial fetch
    refreshSchedules();

    // Listen for real-time changes to bookings on this date
    const q = query(collection(db, "bookings"), where("tanggal", "==", selectedDate));
    const unsub = onSnapshot(q, () => {
      // When any booking on this date changes, re-fetch available slots
      refreshSchedules();
    });

    return () => unsub();
  }, [selectedDate, refreshSchedules]);

  if (loading || authLoading || !user) return <div className="flex h-screen items-center justify-center bg-studio-50"><div className="w-8 h-8 border-4 border-studio-900 border-t-transparent rounded-full animate-spin"></div></div>;

  // Kalkulasi
  const subtotalPaket = selectedPaket ? selectedPaket.hargaDasar : 0;
  const subtotalLayanan = Object.entries(selectedServices).reduce((sum, [id, qty]) => {
    const svc = services.find(s => String(s.id) === String(id) || String(s.id_layanan) === String(id));
    return sum + (svc ? svc.hargaSatuan * qty : 0);
  }, 0);
  const totalSebelumDiskon = subtotalPaket + subtotalLayanan;
  
  let diskon = 0;
  if (appliedVoucher) {
    if (appliedVoucher.tipeDiskon === "persen") diskon = totalSebelumDiskon * (appliedVoucher.nilaiDiskon / 100);
    else diskon = appliedVoucher.nilaiDiskon;
  }
  const totalBayar = Math.max(0, totalSebelumDiskon - diskon);

  const handleApplyVoucher = async () => {
    setVoucherError("");
    if (!voucherCode) return;
    const v = await checkVoucherKode(voucherCode);
    if (v) {
      setAppliedVoucher(v);
    } else {
      setVoucherError("Kode voucher tidak valid.");
      setAppliedVoucher(null);
    }
  };

  const handleServiceChange = (id, change) => {
    setSelectedServices(prev => {
      const current = prev[id] || 0;
      const next = current + change;
      if (next < 0) return prev;
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const proceedToStep2 = () => {
    if (!selectedSchedule) {
      alert("Please select a time slot first.");
      return;
    }
    setStep(2);
  };

  const submitBooking = async () => {
    if (!name || !phone) {
      alert("Please fill in your name and phone number.");
      return;
    }
    if (!selectedPaket || !selectedSchedule) {
      alert("Terjadi kesalahan: Paket atau jadwal belum dipilih.");
      return;
    }
    
    const kodeBooking = `BKG-${Date.now().toString().slice(-6)}`;
    
    const addons = Object.entries(selectedServices).map(([id, qty]) => {
      const svc = services.find(s => String(s.id) === String(id) || String(s.id_layanan) === String(id));
      return {
        id: svc.id || svc.id_layanan || id,
        namaLayanan: svc.namaLayanan,
        hargaSatuan: svc.hargaSatuan,
        qty
      };
    });

    setIsSubmitting(true);
    try {
      const result = await createBookingAction({
        kodeBooking,
        namaPelanggan: name,
        email: email || "guest@example.com",
        noHp: phone,
        packageId: selectedPaket.id_paket || selectedPaket.id,
        scheduleId: selectedSchedule.id,
        tanggal: selectedSchedule.tanggal,
        jamMulai: selectedSchedule.jam_mulai || selectedSchedule.jamMulai,
        totalHarga: totalBayar,
        addons
      });

      if (result && !result.success) {
        alert(result.message || "Gagal membuat booking.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/payment/${kodeBooking}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan sistem saat membuat booking.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Premium Background with Blur Elements */}
      <div className="fixed inset-0 z-[-1] bg-studio-50 overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-studio-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-studio-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <section className="relative min-h-[calc(100vh-72px)] py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="font-serif text-4xl font-bold text-studio-900 mb-2">Book Your Session</h1>
            <p className="text-studio-500 font-medium tracking-wide">Capture your timeless moments with us</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Main Content Area */}
            <div className="flex-1 w-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl shadow-studio-900/5 rounded-2xl p-8 lg:p-10 transition-all duration-500 ease-in-out">
              
              {/* Progress Indicator */}
              <div className="flex items-center gap-4 mb-10">
                <div className="flex flex-col flex-1">
                   <div className="h-1.5 w-full bg-studio-900 rounded-full mb-2"></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-studio-900">Step 1: Schedule</span>
                </div>
                <div className="flex flex-col flex-1">
                   <div className={`h-1.5 w-full rounded-full mb-2 transition-colors duration-300 ${step === 2 ? 'bg-studio-900' : 'bg-studio-200'}`}></div>
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${step === 2 ? 'text-studio-900' : 'text-studio-400'}`}>Step 2: Details</span>
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-serif font-bold text-studio-900">Select Date & Time</h2>
                      <p className="text-sm text-studio-500">Choose your preferred schedule for <span className="font-semibold text-studio-900">{selectedPaket?.namaPaket}</span></p>
                    </div>

                    <div className="space-y-6">
                        {/* Date Picker */}
                        <div className="group">
                            <label className="block text-xs font-bold uppercase tracking-wider text-studio-500 mb-2">Choose Date</label>
                            <div className="relative">
                              <input 
                                type="date" 
                                value={selectedDate} 
                                onChange={(e) => { setSelectedDate(e.target.value); setSelectedSchedule(null); }}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full bg-white border border-studio-200 p-4 pl-12 text-sm text-studio-900 font-medium focus:ring-2 focus:ring-studio-900 focus:border-studio-900 focus:outline-none rounded-xl transition shadow-sm hover:shadow-md" 
                              />
                              <i className="fa-regular fa-calendar absolute left-4 top-1/2 -translate-y-1/2 text-studio-400 group-hover:text-studio-900 transition-colors"></i>
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-studio-500">Available Time Slots</label>
                                <div className="flex items-center gap-4 text-xs font-medium text-studio-500">
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span> Available</span>
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-studio-200"></span> Booked</span>
                                </div>
                            </div>

                            {schedules.length === 0 ? (
                               <div className="bg-red-50 border border-red-100 p-6 rounded-xl text-center">
                                 <i className="fa-regular fa-calendar-xmark text-2xl text-red-400 mb-2"></i>
                                 <p className="text-sm font-medium text-red-600">No slots available on this date. Please choose another date.</p>
                               </div>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                  {schedules.map(s => (
                                    <button 
                                      key={s.id}
                                      onClick={() => setSelectedSchedule(s)} 
                                      className={`relative overflow-hidden p-4 border text-sm font-semibold text-center transition-all duration-300 rounded-xl hover:-translate-y-1 hover:shadow-lg
                                        ${selectedSchedule?.id === s.id 
                                          ? 'bg-studio-900 text-white border-studio-900 shadow-md scale-[1.02]' 
                                          : 'border-studio-200 hover:border-studio-400 text-studio-900 bg-white/50 backdrop-blur-sm'
                                        }`}
                                    >
                                      {s.jamMulai} - {s.jamSelesai}
                                      {selectedSchedule?.id === s.id && (
                                        <div className="absolute inset-0 bg-white/20 blur-sm transform scale-150 rotate-45 pointer-events-none opacity-50"></div>
                                      )}
                                    </button>
                                  ))}
                              </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-8 mt-8 border-t border-studio-200/50">
                        <button onClick={() => router.push('/packages')} className="group flex items-center gap-2 text-sm font-semibold text-studio-500 hover:text-studio-900 transition-colors">
                            <i className="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-1"></i> Back to Packages
                        </button>
                        <button onClick={proceedToStep2} className="btn-primary px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-studio-900/20 hover:shadow-studio-900/40 hover:-translate-y-0.5 transition-all">
                            Continue <i className="fa-solid fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-serif font-bold text-studio-900">Your Details & Add-ons</h2>
                      <p className="text-sm text-studio-500">Complete your information and enhance your session.</p>
                    </div>

                    <div className="space-y-6">
                        {/* Personal Info */}
                        <div className="bg-white/40 p-6 rounded-2xl border border-white/60 space-y-5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-studio-900 border-b border-studio-200/50 pb-3">Personal Information</h3>
                          <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-studio-600 mb-2">Full Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full bg-white border border-studio-200 p-3.5 text-sm font-medium focus:ring-2 focus:ring-studio-900 focus:border-studio-900 focus:outline-none rounded-xl transition shadow-sm hover:shadow-md" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-studio-600 mb-2">Phone Number</label>
                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08..." className="w-full bg-white border border-studio-200 p-3.5 text-sm font-medium focus:ring-2 focus:ring-studio-900 focus:border-studio-900 focus:outline-none rounded-xl transition shadow-sm hover:shadow-md" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-studio-600 mb-2">Email Address</label>
                                <input type="email" value={email} disabled className="w-full bg-studio-50/50 border border-studio-200 p-3.5 text-sm font-medium text-studio-500 rounded-xl cursor-not-allowed opacity-80" />
                            </div>
                          </div>
                        </div>

                        {/* Add-ons */}
                        <div className="bg-white/40 p-6 rounded-2xl border border-white/60">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-studio-900 border-b border-studio-200/50 pb-3 mb-5">Enhance Your Session</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {services.map(s => (
                                  <div key={s.id} className="flex flex-col justify-between p-4 bg-white border border-studio-900 rounded-xl shadow-sm hover:shadow-md hover:border-studio-900 transition-all">
                                      <div className="mb-4">
                                          <span className="text-sm font-bold text-studio-900 block">{s.namaLayanan}</span>
                                          <span className="text-xs font-medium text-studio-600">+Rp {s.hargaSatuan?.toLocaleString('id-ID')}</span>
                                      </div>
                                      <div className="flex items-center justify-between bg-studio-50 rounded-lg p-1">
                                          <button onClick={() => handleServiceChange(s.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-studio-600 hover:text-studio-900 hover:bg-studio-100 transition"><i className="fa-solid fa-minus text-xs"></i></button>
                                          <span className="text-sm font-bold w-8 text-center">{selectedServices[s.id] || 0}</span>
                                          <button onClick={() => handleServiceChange(s.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-studio-600 hover:text-studio-900 hover:bg-studio-100 transition"><i className="fa-solid fa-plus text-xs"></i></button>
                                      </div>
                                  </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 mt-8">
                        <button onClick={() => setStep(1)} className="group flex items-center gap-2 text-sm font-semibold text-studio-500 hover:text-studio-900 transition-colors">
                            <i className="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-1"></i> Back to Schedule
                        </button>
                    </div>
                </div>
              )}
            </div>

            {/* Sidebar Order Summary */}
            <div className="w-full lg:w-[380px] shrink-0">
               <div className="bg-studio-900 text-white p-8 rounded-2xl shadow-2xl sticky top-24 transform transition-all hover:-translate-y-1 duration-500">
                  <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-3">
                    <i className="fa-solid fa-receipt text-indigo-400"></i> Order Summary
                  </h3>

                  <div className="space-y-4 text-sm font-medium mb-6 border-b border-white/20 pb-6">
                      <div className="flex justify-between items-center">
                          <span className="text-studio-300">Package</span>
                          <span className="text-right font-bold text-indigo-300">{selectedPaket?.namaPaket || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-studio-300">Date</span>
                          <span className="text-right font-bold">{selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-studio-300">Time</span>
                          <span className="text-right font-bold bg-white/10 px-2 py-0.5 rounded">{selectedSchedule?.jamMulai || "-"}</span>
                      </div>
                  </div>

                  <div className="mb-6 border-b border-white/20 pb-6">
                      <label className="block text-xs font-bold uppercase tracking-wider text-studio-300 mb-3">Promo Code</label>
                      <div className="flex gap-2">
                          <input type="text" placeholder="Enter code" value={voucherCode} onChange={e => setVoucherCode(e.target.value.toUpperCase())} className="w-full bg-white/10 border border-white/20 p-3 text-sm uppercase font-bold text-white placeholder-white/40 focus:ring-2 focus:ring-indigo-400 focus:outline-none rounded-xl transition" />
                          <button onClick={handleApplyVoucher} className="bg-white/20 hover:bg-white/30 px-5 text-sm font-bold rounded-xl transition">Apply</button>
                      </div>
                      {voucherError && <p className="text-xs font-medium text-red-400 mt-2 flex items-center gap-1.5"><i className="fa-solid fa-circle-exclamation"></i> {voucherError}</p>}
                      {appliedVoucher && <p className="text-xs font-medium text-green-400 mt-2 flex items-center gap-1.5"><i className="fa-solid fa-circle-check"></i> Code applied successfully!</p>}
                  </div>

                  <div className="space-y-3 text-sm font-medium mb-8">
                      <div className="flex justify-between text-studio-300">
                          <span>Subtotal Package</span>
                          <span>Rp {subtotalPaket.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-studio-300">
                          <span>Add-ons</span>
                          <span>Rp {subtotalLayanan.toLocaleString('id-ID')}</span>
                      </div>
                      {diskon > 0 && (
                        <div className="flex justify-between text-green-400 font-bold bg-green-400/10 p-2 rounded-lg -mx-2">
                            <span>Discount ({appliedVoucher?.kodeVoucher})</span>
                            <span>-Rp {diskon.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-end pt-6 mt-2 border-t border-white/20">
                          <span className="text-base font-bold text-white">Total</span>
                          <span className="text-3xl font-bold text-indigo-400 tracking-tight">Rp {totalBayar.toLocaleString('id-ID')}</span>
                      </div>
                  </div>

                  <button 
                    onClick={submitBooking} 
                    disabled={step === 1 || !selectedSchedule}
                    className="w-full py-4 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2
                      disabled:opacity-50 disabled:cursor-not-allowed
                      bg-white text-studio-900 hover:bg-indigo-50 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:-translate-y-0.5"
                  >
                      {step === 1 ? 'Complete Step 1 First' : 'Proceed to Payment'}
                  </button>
               </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-studio-50"><div className="w-8 h-8 border-4 border-studio-900 border-t-transparent rounded-full animate-spin"></div></div>}>
      <BookingFlow />
    </Suspense>
  );
}
