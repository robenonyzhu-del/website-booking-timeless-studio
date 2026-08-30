"use client";

import { usePathname } from "next/navigation";

export default function GlobalFooter() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-studio-900 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="font-serif font-bold text-xl text-studio-900 tracking-wider mb-4">TIMELESS</h3>
            <p className="text-sm text-studio-500 leading-relaxed max-w-xs">
              Self Photo Studio premium yang memberikan Anda kebebasan penuh untuk berekspresi tanpa batasan. Ciptakan momen abadi Anda hari ini.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-studio-900 uppercase tracking-widest text-xs mb-4">Bantuan</h4>
            <ul className="space-y-3 text-sm text-studio-500">
              <li><a href="/faq" className="hover:text-studio-900 transition-colors">Tanya Jawab (FAQ)</a></li>
              <li><a href="/contact" className="hover:text-studio-900 transition-colors">Hubungi Kami</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-studio-900 uppercase tracking-widest text-xs mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-studio-500">
              <li><a href="/terms" className="hover:text-studio-900 transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="/privacy" className="hover:text-studio-900 transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-studio-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-studio-400">
            &copy; 2026 Timeless Photo Studio. Hak cipta dilindungi.
          </div>
          <div className="flex gap-4 text-studio-400">
            <a href="#" className="hover:text-studio-900 transition-colors"><i className="fa-brands fa-instagram text-lg"></i></a>
            <a href="#" className="hover:text-studio-900 transition-colors"><i className="fa-brands fa-whatsapp text-lg"></i></a>
            <a href="#" className="hover:text-studio-900 transition-colors"><i className="fa-brands fa-tiktok text-lg"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
