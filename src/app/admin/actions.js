"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";

// === SCHEDULES ===
export async function deleteScheduleAction(id) {
  await deleteDoc(doc(db, "schedules", id));
  revalidatePath("/admin/schedules");
}

export async function createScheduleAction(data) {
  await addDoc(collection(db, "schedules"), {
    tanggal: data.tanggal,
    jamMulai: data.jam_mulai,
    jamSelesai: data.jam_selesai,
    statusSlot: data.status_slot || "tersedia"
  });
  revalidatePath("/admin/schedules");
}

export async function updateScheduleAction(id, data) {
  await updateDoc(doc(db, "schedules", id), {
    statusSlot: data.status_slot
  });
  revalidatePath("/admin/schedules");
}

// === BOOKINGS ===
export async function createBookingAction(data) {
  try {
    // Cegah double-booking dengan mengecek apakah sudah ada booking di tanggal dan jam yang sama
    const q = query(
      collection(db, "bookings"),
      where("tanggal", "==", data.tanggal),
      where("jamMulai", "==", data.jamMulai)
    );
    
    const snapshot = await getDocs(q);
    const isBooked = snapshot.docs.some(doc => {
      const status = doc.data().status;
      return status !== "dibatalkan" && status !== "kadaluarsa";
    });

    if (isBooked) {
      return { success: false, message: "Jadwal ini sudah dipesan oleh orang lain. Silakan pilih jadwal lain." };
    }

    await addDoc(collection(db, "bookings"), {
      kodeBooking: data.kodeBooking,
      namaPelanggan: data.namaPelanggan,
      email: data.email,
      noHp: data.noHp,
      packageId: data.packageId,
      scheduleId: data.scheduleId,
      tanggal: data.tanggal,
      jamMulai: data.jamMulai,
      totalHarga: data.totalHarga,
      addons: data.addons || [],
      status: "menunggu_pembayaran",
      createdAt: Date.now()
    });
    
    revalidatePath('/admin/bookings');
    return { success: true };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, message: "Terjadi kesalahan internal server saat membuat booking." };
  }
}

export async function updateBookingStatusAction(id, status) {
  await updateDoc(doc(db, "bookings", id), { status });
  revalidatePath('/admin/bookings');
}

// === PACKAGES ===
export async function createPackageAction(data) {
  await addDoc(collection(db, "packages"), {
    namaPaket: data.namaPaket,
    kategori: data.kategori,
    hargaDasar: Number(data.hargaDasar),
    durasiMenit: Number(data.durasiMenit),
    maksOrang: Number(data.maksOrang),
    deskripsi: data.deskripsi,
    isPopular: data.isPopular || false
  });
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/booking");
}

export async function updatePackageAction(id, data) {
  await updateDoc(doc(db, "packages", id), {
    namaPaket: data.namaPaket,
    kategori: data.kategori,
    hargaDasar: Number(data.hargaDasar),
    durasiMenit: Number(data.durasiMenit),
    maksOrang: Number(data.maksOrang),
    deskripsi: data.deskripsi,
    isPopular: data.isPopular || false
  });
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/booking");
}

export async function deletePackageAction(id) {
  await deleteDoc(doc(db, "packages", id));
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/booking");
}

// === ADDITIONAL SERVICES ===
export async function createServiceAction(data) {
  await addDoc(collection(db, "additionalServices"), {
    namaLayanan: data.namaLayanan,
    hargaSatuan: Number(data.hargaSatuan)
  });
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/booking");
}

export async function updateServiceAction(id, data) {
  await updateDoc(doc(db, "additionalServices", id), {
    namaLayanan: data.namaLayanan,
    hargaSatuan: Number(data.hargaSatuan)
  });
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/booking");
}

export async function deleteServiceAction(id) {
  await deleteDoc(doc(db, "additionalServices", id));
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath("/booking");
}

// === VOUCHERS ===
export async function createVoucherAction(data) {
  await addDoc(collection(db, "vouchers"), {
    kodeVoucher: data.kodeVoucher,
    tipeDiskon: data.tipeDiskon,
    nilaiDiskon: Number(data.nilaiDiskon),
    tglBerakhir: data.tglBerakhir,
    kuota: Number(data.kuota)
  });
  revalidatePath("/admin/vouchers");
}

export async function updateVoucherAction(id, data) {
  await updateDoc(doc(db, "vouchers", id), {
    kodeVoucher: data.kodeVoucher,
    tipeDiskon: data.tipeDiskon,
    nilaiDiskon: Number(data.nilaiDiskon),
    tglBerakhir: data.tglBerakhir,
    kuota: Number(data.kuota)
  });
  revalidatePath("/admin/vouchers");
}

export async function deleteVoucherAction(id) {
  await deleteDoc(doc(db, "vouchers", id));
  revalidatePath("/admin/vouchers");
}

