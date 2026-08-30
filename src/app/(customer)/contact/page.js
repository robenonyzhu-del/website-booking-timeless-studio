import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="bg-studio-50 min-h-screen py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-studio-200">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-serif font-bold text-studio-900 mb-4">Hubungi Kami</h1>
            <p className="text-studio-500">Ada pertanyaan, masukan, atau kendala dalam melakukan pemesanan? Jangan ragu untuk menghubungi tim Timeless Studio!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-studio-200 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-md transition">
              <div className="w-16 h-16 bg-studio-100 rounded-full flex items-center justify-center mb-6">
                <i className="fa-brands fa-whatsapp text-3xl text-studio-900"></i>
              </div>
              <h2 className="text-xl font-bold text-studio-900 mb-2">WhatsApp</h2>
              <p className="text-sm text-studio-500 mb-6">Hubungi admin kami untuk pertanyaan cepat (Fast Response).</p>
              <a href="https://wa.me/6281214898668" target="_blank" rel="noopener noreferrer" className="mt-auto bg-studio-900 text-white px-6 py-2 rounded-md hover:bg-studio-800 transition text-sm font-medium">
                0812 1489 8668
              </a>
            </div>
            
            <div className="border border-studio-200 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-md transition">
              <div className="w-16 h-16 bg-studio-100 rounded-full flex items-center justify-center mb-6">
                <i className="fa-brands fa-instagram text-3xl text-studio-900"></i>
              </div>
              <h2 className="text-xl font-bold text-studio-900 mb-2">Instagram</h2>
              <p className="text-sm text-studio-500 mb-6">Lihat portofolio kami, dapatkan promo terbaru, atau DM kami.</p>
              <a href="#" className="mt-auto bg-studio-900 text-white px-6 py-2 rounded-md hover:bg-studio-800 transition text-sm font-medium">
                @timelesstudio
              </a>
            </div>
          </div>
          
          <div className="mt-12 bg-studio-900 text-white rounded-lg p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-2">Lokasi Studio</h2>
              <p className="text-studio-400 text-sm max-w-md leading-relaxed">
                Jl. Pangeran Santri No. 42,<br />
                Sumedang, Jawa Barat, Indonesia.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a href="https://www.google.com/maps/search/?api=1&query=Timeless+Self+Photo+Studio+Jl.+Pangeran+Santri+No.+42,+Sumedang" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-studio-900 px-6 py-3 rounded-md hover:bg-gray-100 transition font-medium text-sm">
                <i className="fa-solid fa-map-location-dot"></i> Buka di Google Maps
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
