"use client";

import { useState, useEffect } from "react";
import { getSchedules } from "@/lib/data";

export default function SchedulesPage() {
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      // Simulate network request
      const data = await getSchedules(tanggal);
      setSchedules(data);
      setLoading(false);
    };
    fetchSchedules();
  }, [tanggal]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Ketersediaan Jadwal</h2>
          <p className="mt-4 text-lg text-gray-500">Cek slot waktu yang tersedia untuk sesi foto Anda.</p>
        </div>

        <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm ring-1 ring-gray-200">
          <div className="mb-6">
            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">Pilih Tanggal</label>
            <input
              type="date" id="tanggal"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Memuat jadwal...</p>
          ) : schedules.length === 0 ? (
            <p className="text-center text-gray-500">Tidak ada jadwal tersedia untuk tanggal ini.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {schedules.map((s) => (
                <div
                  key={s.id_jadwal}
                  className={`p-4 rounded-lg border text-center ${
                    s.status_slot === "tersedia" 
                      ? "border-green-200 bg-green-50 text-green-700" 
                      : s.status_slot === "dipesan" 
                      ? "border-gray-200 bg-gray-50 text-gray-400"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  <p className="font-bold">{s.jam_mulai} - {s.jam_selesai}</p>
                  <p className="text-sm uppercase tracking-wide mt-1">{s.status_slot}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
