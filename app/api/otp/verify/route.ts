import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json()

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP required" },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if OTP is valid and not expired
    const result = await sql`
      SELECT id, phone_number
      FROM profiles
      WHERE phone_number = ${phone}
      AND otp_code = ${otp}
      AND otp_expires_at > NOW()
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Invalid OTP or phone number" },
        { status: 401 }
      )
    }

    const user = result[0]

    // Clear OTP after successful verification
    await sql`
      UPDATE profiles
      SET otp_code = NULL, otp_expires_at = NULL
      WHERE id = ${user.id}
    `

    // Return success - client will handle session creation via signIn
    return NextResponse.json({ 
      success: true,
      phone: user.phone_number 
    })
  } catch (error) {
    console.error("[v0] Verify OTP error:", error)
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    )
  }
}
