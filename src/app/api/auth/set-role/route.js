import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(req) {
  try {
    const { idToken, role, adminSecret } = await req.json();

    if (!idToken || !role) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Verify the caller's token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Security check: only existing admins or someone with the secret can set roles
    if (role === "admin") {
      const isAlreadyAdmin = decodedToken.claims.role === "admin";
      const hasSecret = adminSecret && process.env.ADMIN_SECRET && adminSecret === process.env.ADMIN_SECRET;
      
      if (!isAlreadyAdmin && !hasSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    // Set custom claims
    await adminAuth.setCustomUserClaims(decodedToken.uid, { role });
    
    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("Error setting custom claims:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
