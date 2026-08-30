import Link from "next/link";
import { getBookings } from "@/lib/data";

export default async function AdminDashboard() {
  const bookings = await getBookings();
  
  // Calculate dynamic data
  const newBookingsCount = bookings.filter(b => b.status === 'menunggu_pembayaran').length;
  
  const today = new Date().toISOString().split("T")[0];
  const todaysBookings = bookings.filter(b => b.tanggal === today).length;
  
  const revenue = bookings
    .filter(b => b.status === 'dibayar')
    .reduce((sum, b) => sum + (Number(b.totalHarga) || 0), 0);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(1)}K`;
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-semibold text-studio-900 mb-2">Admin Dashboard</h1>
        <p className="text-sm text-studio-500 uppercase tracking-widest">Overview & Control Panel</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="bg-white border border-studio-200 p-6 rounded-sm shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
             <div className="w-10 h-10 rounded bg-studio-100 flex items-center justify-center text-studio-900">
                <i className="fa-solid fa-calendar-check"></i>
             </div>
             <span className="text-2xl font-serif font-semibold text-studio-900">{newBookingsCount}</span>
          </div>
          <h3 className="text-sm font-medium text-studio-500 uppercase tracking-wider mb-1">New Bookings (Unpaid)</h3>
          <Link href="/admin/bookings" className="text-xs font-semibold text-studio-900 hover:underline">View details &rarr;</Link>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-studio-200 p-6 rounded-sm shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
             <div className="w-10 h-10 rounded bg-studio-100 flex items-center justify-center text-studio-900">
                <i className="fa-solid fa-clock"></i>
             </div>
             <span className="text-2xl font-serif font-semibold text-studio-900">{todaysBookings}</span>
          </div>
          <h3 className="text-sm font-medium text-studio-500 uppercase tracking-wider mb-1">Today's Bookings</h3>
          <Link href="/admin/bookings" className="text-xs font-semibold text-studio-900 hover:underline">View bookings &rarr;</Link>
        </div>

        {/* Card 3 */}
        <div className="bg-studio-900 border border-studio-900 p-6 rounded-sm shadow-sm hover:shadow-lg transition">
          <div className="flex justify-between items-start mb-4">
             <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-white">
                <i className="fa-solid fa-chart-line"></i>
             </div>
             <span className="text-2xl font-serif font-semibold text-white">{formatCurrency(revenue)}</span>
          </div>
          <h3 className="text-sm font-medium text-studio-400 uppercase tracking-wider mb-1">Total Revenue</h3>
          <Link href="/admin/bookings" className="text-xs font-semibold text-white hover:underline">View full report &rarr;</Link>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="pt-8 border-t border-studio-200">
        <h2 className="text-lg font-serif font-semibold text-studio-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/admin/packages" className="flex flex-col items-center justify-center w-full border border-studio-200 bg-white rounded-sm p-6 text-center hover:border-studio-900 transition group">
            <i className="fa-solid fa-box text-2xl text-studio-400 group-hover:text-studio-900 mb-3 transition"></i>
            <span className="text-xs font-medium text-studio-600 uppercase tracking-wider group-hover:text-studio-900 transition">Add Package</span>
          </Link>
          <Link href="/admin/schedules" className="flex flex-col items-center justify-center w-full border border-studio-200 bg-white rounded-sm p-6 text-center hover:border-studio-900 transition group">
            <i className="fa-solid fa-clock text-2xl text-studio-400 group-hover:text-studio-900 mb-3 transition"></i>
            <span className="text-xs font-medium text-studio-600 uppercase tracking-wider group-hover:text-studio-900 transition">Operating Hours</span>
          </Link>
          <Link href="/admin/vouchers" className="flex flex-col items-center justify-center w-full border border-studio-200 bg-white rounded-sm p-6 text-center hover:border-studio-900 transition group">
            <i className="fa-solid fa-ticket text-2xl text-studio-400 group-hover:text-studio-900 mb-3 transition"></i>
            <span className="text-xs font-medium text-studio-600 uppercase tracking-wider group-hover:text-studio-900 transition">Create Voucher</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
