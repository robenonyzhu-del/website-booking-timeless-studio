"use client";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { createAdminAccount } from "@/lib/admin-auth";
import { useAuth } from "@/lib/auth-context";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "admin"));
      const snapshot = await getDocs(q);
      const adminList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdmins(adminList);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage({ text: "Harap isi semua kolom.", type: "error" });
      return;
    }
    if (password.length < 6) {
      setMessage({ text: "Password minimal 6 karakter.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "Mendaftarkan admin baru...", type: "info" });

    const result = await createAdminAccount(email, password, name);

    if (result.success) {
      setMessage({ text: "Berhasil! Admin baru telah ditambahkan.", type: "success" });
      setName("");
      setEmail("");
      setPassword("");
      fetchAdmins(); // Refresh list
    } else {
      setMessage({ text: `Gagal: ${result.error}`, type: "error" });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-studio-900 mb-2">Manajemen Admin</h1>
        <p className="text-studio-500">Kelola dan tambahkan akses untuk tim staf Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah Admin */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-studio-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-studio-900 mb-6 border-b border-studio-100 pb-4">Tambah Admin Baru</h2>
            
            {message.text && (
              <div className={`p-4 rounded-md mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-studio-900 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-studio-50 border border-studio-200 p-3 text-sm focus:ring-2 focus:ring-studio-900 rounded-md outline-none transition" 
                  placeholder="Staf 1"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-studio-900 uppercase tracking-wider mb-2">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-studio-50 border border-studio-200 p-3 text-sm focus:ring-2 focus:ring-studio-900 rounded-md outline-none transition" 
                  placeholder="admin@timeless.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-studio-900 uppercase tracking-wider mb-2">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-studio-50 border border-studio-200 p-3 text-sm focus:ring-2 focus:ring-studio-900 rounded-md outline-none transition" 
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full btn-primary py-3 rounded-md text-sm font-bold uppercase tracking-wider mt-4 disabled:opacity-50"
              >
                {isSubmitting ? "Memproses..." : "Daftarkan Admin"}
              </button>
            </form>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-3">
              <i className="fa-solid fa-circle-info text-yellow-600 mt-1"></i>
              <p className="text-xs text-yellow-700 leading-relaxed">
                Pembuatan akun menggunakan <i>Secondary App</i>, sehingga sesi login Anda saat ini tidak akan ter-logout secara otomatis.
              </p>
            </div>
          </div>
        </div>

        {/* Daftar Admin */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-studio-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-studio-900 mb-6 border-b border-studio-100 pb-4">Daftar Admin Aktif</h2>
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-studio-50 rounded-md"></div>)}
              </div>
            ) : admins.length === 0 ? (
              <div className="text-center py-12 text-studio-500">Belum ada admin terdaftar.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-studio-50 border-y border-studio-200 text-xs font-bold uppercase tracking-wider text-studio-600">
                      <th className="p-4">Nama</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Didaftarkan Pada</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.id} className="border-b border-studio-100 hover:bg-studio-50/50 transition">
                        <td className="p-4 font-bold text-studio-900">{admin.namaLengkap}</td>
                        <td className="p-4 text-sm text-studio-600">{admin.email}</td>
                        <td className="p-4 text-sm text-studio-600">
                          {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : "-"}
                        </td>
                        <td className="p-4 text-center">
                          {admin.id === user?.uid ? (
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Anda (Aktif)</span>
                          ) : (
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Admin</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
