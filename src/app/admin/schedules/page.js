export default function AdminSchedulesPage() {
  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Pengaturan Jadwal</h1>
          <p className="mt-2 text-sm text-gray-700">Informasi jam operasional studio.</p>
        </div>
      </div>
      
      <div className="mt-4 bg-studio-50 border border-studio-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
        <div className="mx-auto w-16 h-16 bg-studio-200 rounded-full flex items-center justify-center mb-4">
           <i className="fa-solid fa-robot text-2xl text-studio-900"></i>
        </div>
        <h2 className="text-xl font-serif font-bold text-studio-900 mb-2">Sistem Jadwal Otomatis Aktif</h2>
        <p className="text-studio-600 mb-6">
          Anda tidak perlu lagi membuat slot jadwal secara manual. Sistem kini secara pintar dan otomatis akan memunculkan slot waktu kepada pelanggan berdasarkan jam operasional di bawah ini.
        </p>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-studio-200 text-left">
           <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Jam Operasional Tetap</h3>
           <ul className="space-y-3">
             <li className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Hari Buka</span>
                <span className="font-medium text-gray-900">Senin - Minggu (Setiap Hari)</span>
             </li>
             <li className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Jam Buka</span>
                <span className="font-medium text-gray-900">10:00 WIB</span>
             </li>
             <li className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Jam Tutup</span>
                <span className="font-medium text-gray-900">18:00 WIB</span>
             </li>
             <li className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Durasi Per Slot</span>
                <span className="font-medium text-gray-900">30 Menit</span>
             </li>
           </ul>
        </div>
      </div>
    </div>
  );
}
