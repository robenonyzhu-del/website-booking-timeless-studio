import { getBookings } from "@/lib/data";

export default async function AdminBookingsPage() {
  const bookings = await getBookings();
  
  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Manajemen Pemesanan</h1>
          <p className="mt-2 text-sm text-gray-700">Kelola data booking, verifikasi pembayaran, dan data pelanggan.</p>
        </div>
      </div>
      
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Kode Booking</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pelanggan</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Paket & Tanggal</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Tagihan</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900">{b.kodeBooking}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="font-medium text-gray-900">{b.namaPelanggan}</div>
                    <div className="text-xs text-gray-400">{b.noHp}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {b.package?.namaPaket || "-"}<br/>
                    <span className="text-xs text-gray-400">{b.schedule?.tanggal || "-"} ({b.schedule?.jamMulai || "-"})</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Rp {b.totalHarga?.toLocaleString('id-ID') || 0}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      b.status === 'dibayar' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                      'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                    }`}>
                      {b.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    {b.status === 'menunggu_pembayaran' ? (
                      <span className="text-xs text-gray-400 italic">Menunggu Otomatis (Webhook)</span>
                    ) : (
                      <span className="text-xs text-green-600 font-semibold"><i className="fa-solid fa-check mr-1"></i> Terverifikasi Otomatis</span>
                    )}
                  </td>
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
