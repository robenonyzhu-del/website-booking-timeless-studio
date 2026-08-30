"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "Berapa lama batas waktu keterlambatan?",
      a: "Kami tidak memberikan toleransi tambahan waktu untuk keterlambatan. Jika Anda menyewa sesi 30 menit dan datang terlambat 10 menit, maka waktu sesi Anda yang tersisa hanyalah 20 menit. Pastikan datang 10-15 menit lebih awal!"
    },
    {
      q: "Apakah boleh membawa hewan peliharaan (Pet-friendly)?",
      a: "Ya! Kami pet-friendly, namun kami mohon agar Anda selalu menjaga kebersihan studio dan memastikan peliharaan Anda memakai popok/pampers khusus hewan agar tidak membuang kotoran sembarangan."
    },
    {
      q: "Berapa lama saya mendapatkan soft file (seluruh foto)?",
      a: "Soft file biasanya kami kirimkan dalam kurun waktu kurang dari 24 jam setelah sesi selesai melalui link Google Drive yang dikirim ke WhatsApp/Email Anda."
    },
    {
      q: "Apakah saya bisa ganti baju di studio?",
      a: "Tentu! Kami menyediakan ruang ganti yang cukup luas dan nyaman di dalam area studio untuk Anda bersiap-siap atau berganti pakaian selama sesi berlangsung."
    },
    {
      q: "Apakah ada batasan maksimal orang dalam satu frame?",
      a: "Setiap paket memiliki batas maksimal orang (misalnya 2, 4, atau 6). Jika jumlah orang melebihi kapasitas yang ditentukan oleh paket, Anda akan dikenakan biaya tambahan (Additional Charge) per orang di tempat."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="bg-studio-50 min-h-screen py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-studio-200">
          <h1 className="text-3xl font-serif font-bold text-studio-900 mb-8 border-b pb-4 text-center">Tanya Jawab (FAQ)</h1>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-studio-200 rounded-md overflow-hidden">
                <button 
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left font-bold text-studio-900 bg-studio-50 hover:bg-studio-100 transition flex justify-between items-center"
                >
                  {faq.q}
                  <i className={`fa-solid fa-chevron-down transition-transform ${openIndex === index ? 'rotate-180' : ''}`}></i>
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 text-studio-600 bg-white leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center text-studio-500 text-sm">
            Masih punya pertanyaan lain? <a href="/contact" className="font-bold text-studio-900 hover:underline">Hubungi Kami!</a>
          </div>
        </div>
      </div>
    </>
  );
}
