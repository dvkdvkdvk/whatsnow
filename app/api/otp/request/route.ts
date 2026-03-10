import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()
    console.log("[v0] OTP request for phone:", phone)

    if (!phone || !/^\+?[1-9]\d{1,14}$/.test(phone)) {
      console.log("[v0] Invalid phone format:", phone)
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      )
    }

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error("[v0] DATABASE_URL is not set")
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    console.log("[v0] Generated OTP:", otp, "Expires at:", expiresAt)

    const sql = neon(process.env.DATABASE_URL)
    console.log("[v0] Database connection initialized")

    // Check if user exists, if not create them
    let existing
    try {
      existing = await sql`
        SELECT id FROM profiles WHERE phone_number = ${phone}
      `
      console.log("[v0] Existing user check result:", existing.length)
    } catch (dbError) {
      console.error("[v0] Database query error:", dbError instanceof Error ? dbError.message : dbError)
      throw new Error("Database query failed")
    }

    if (existing.length === 0) {
      console.log("[v0] Creating new user")
      // Use phone number as placeholder email for WhatsApp-only signups
      const placeholderEmail = `${phone.replace(/\+/g, '')}@whatsapp.local`
      await sql`
        INSERT INTO profiles (email, phone_number, otp_code, otp_expires_at)
        VALUES (${placeholderEmail}, ${phone}, ${otp}, ${expiresAt})
      `
    } else {
      console.log("[v0] Updating existing user")
      await sql`
        UPDATE profiles
        SET otp_code = ${otp}, otp_expires_at = ${expiresAt}
        WHERE phone_number = ${phone}
      `
    }

    console.log("[v0] OTP saved successfully")

    return NextResponse.json({
      message: "OTP sent to your WhatsApp",
      demo_otp: otp,
    })
  } catch (error) {
    console.error("[v0] Request OTP error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: "Failed to generate OTP" },
      { status: 500 }
    )
  }
}
