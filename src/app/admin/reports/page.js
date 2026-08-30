import { getBookings } from "@/lib/data";

export default async function AdminReportsPage() {
  const bookings = await getBookings();
  
  // Kalkulasi total tagihan
  const totalPendapatan = bookings.filter(b => b.status === "dibayar").reduce((sum, b) => sum + b.totalHarga, 0);
  const totalMenunggu = bookings.filter(b => b.status === "menunggu_pembayaran").reduce((sum, b) => sum + b.totalHarga, 0);

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Laporan Keuangan</h1>
          <p className="mt-2 text-sm text-gray-700">Ringkasan pendapatan dari seluruh pemesanan.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white border border-studio-200 p-6 rounded-sm shadow-sm">
          <h3 className="text-sm font-medium text-studio-500 uppercase tracking-wider mb-1">Total Pendapatan Bersih</h3>
          <span className="text-3xl font-serif font-semibold text-studio-900">Rp {totalPendapatan.toLocaleString('id-ID')}</span>
        </div>
        <div className="bg-white border border-studio-200 p-6 rounded-sm shadow-sm">
          <h3 className="text-sm font-medium text-studio-500 uppercase tracking-wider mb-1">Menunggu Pembayaran</h3>
          <span className="text-3xl font-serif font-semibold text-studio-500">Rp {totalMenunggu.toLocaleString('id-ID')}</span>
        </div>
        <div className="bg-white border border-studio-200 p-6 rounded-sm shadow-sm">
          <h3 className="text-sm font-medium text-studio-500 uppercase tracking-wider mb-1">Total Transaksi</h3>
          <span className="text-3xl font-serif font-semibold text-studio-900">{bookings.length} Pesanan</span>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Kode Booking</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900">{b.kodeBooking}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                     <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      b.status === 'dibayar' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                      'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                    }`}>
                      {b.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Rp {b.totalHarga.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
