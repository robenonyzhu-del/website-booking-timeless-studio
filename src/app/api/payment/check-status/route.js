import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { getTransactionStatus } from "@/lib/ronzzpay";

export async function POST(request) {
  try {
    const { kode_booking } = await request.json();

    if (!kode_booking) {
      return NextResponse.json({ success: false, message: "Missing kode_booking" }, { status: 400 });
    }

    // Ambil data booking
    const q = query(collection(db, "bookings"), where("kodeBooking", "==", kode_booking));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    const bookingDoc = querySnapshot.docs[0];
    const bookingRef = doc(db, "bookings", bookingDoc.id);
    const bookingData = bookingDoc.data();

    if (bookingData.status === "dibayar") {
      return NextResponse.json({ success: true, status: "dibayar" });
    }

    if (!bookingData.paymentReffId) {
      return NextResponse.json({ success: false, message: "No payment transaction found" }, { status: 400 });
    }

    // Cek status ke API RonzzPay
    const result = await getTransactionStatus(bookingData.paymentReffId);

    if (result.status && result.data) {
      const ronzzStatus = result.data.status.toLowerCase();
      
      // Jika berhasil di server RonzzPay, update Firestore
      if (ronzzStatus === 'success' || ronzzStatus === 'settlement' || ronzzStatus === 'berhasil' || ronzzStatus === 'paid') {
        await updateDoc(bookingRef, {
          status: "dibayar",
          paidAt: Date.now()
        });

        // Kirim notifikasi email ke Pelanggan
        try {
          const { sendCustomerNotification } = await import('@/lib/email');
          await sendCustomerNotification(bookingData);
        } catch (emailErr) {
          console.error("Gagal memanggil fungsi email:", emailErr);
        }

        return NextResponse.json({ success: true, status: "dibayar" });
      }

      return NextResponse.json({ success: true, status: ronzzStatus });
    }

    return NextResponse.json({ success: false, message: "Gagal mengecek status" }, { status: 400 });
  } catch (error) {
    console.error("Error checking status:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
