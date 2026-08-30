import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { createTransaction } from "@/lib/ronzzpay";

export async function POST(request) {
  try {
    const { kode_booking, payment_method } = await request.json();

    if (!kode_booking || !payment_method) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
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
      return NextResponse.json({ success: false, message: "Booking is already paid" }, { status: 400 });
    }

    // Hitung total (jika ada add-ons)
    const totalAmount = bookingData.totalHarga || 0;

    // Untuk development lokal webhook testing
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (request.headers.get("origin") || "http://localhost:3000");
    const webhookUrl = `${baseUrl}/api/payment/webhook`;

    // Buat transaksi di RonzzPay
    const result = await createTransaction(
      payment_method, // e.g. "qris"
      totalAmount,
      `Pembayaran Booking ${kode_booking}`,
      webhookUrl
    );

    if (result.status && result.data) {
      // Simpan reference ID ke database booking agar bisa dicek statusnya nanti
      await updateDoc(bookingRef, {
        paymentReffId: result.data.reff_id,
        paymentMethod: payment_method,
      });

      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json({ success: false, message: result.message || "Gagal membuat transaksi" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error creating transaction:", error);
    const errorMessage = error.response?.data?.message || error.message;
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
