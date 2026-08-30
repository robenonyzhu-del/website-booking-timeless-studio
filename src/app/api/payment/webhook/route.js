import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { verifySignature } from "@/lib/ronzzpay";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || request.headers.get("X-Signature");

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    console.log(`\n🔔 Webhook Event Received: ${payload.event}`);

    if (["transaction.success", "transaction.failed", "transaction.expired"].includes(payload.event)) {
      const { reff_id, status } = payload.data;

      // Cari booking berdasarkan paymentReffId
      const q = query(collection(db, "bookings"), where("paymentReffId", "==", reff_id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const bookingDoc = querySnapshot.docs[0];
        
        let newStatus = bookingDoc.data().status;
        if (status === "success" || status === "settlement") {
          newStatus = "dibayar";
        } else if (status === "expired" || status === "failed" || status === "cancel") {
          newStatus = "gagal";
        }

        await updateDoc(doc(db, "bookings", bookingDoc.id), {
          status: newStatus,
        });

        if (newStatus === "dibayar") {
          try {
            const { sendCustomerNotification } = await import('@/lib/email');
            await sendCustomerNotification(bookingDoc.data());
          } catch (emailErr) {
            console.error("Gagal memanggil fungsi email di webhook:", emailErr);
          }
        }

        console.log(`✅ Webhook processed. Booking ${bookingDoc.id} status updated to ${newStatus}.`);
      } else {
        console.warn(`⚠️ No booking found with paymentReffId: ${reff_id}`);
      }
    }

    return NextResponse.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
