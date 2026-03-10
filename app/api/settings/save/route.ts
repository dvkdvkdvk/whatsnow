import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: NextRequest) {
  try {
    const { verifyToken, apiKey, webhookUrl } = await request.json()

    console.log("[v0] Saving settings to database")

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not configured")
    }

    if (!verifyToken) {
      return NextResponse.json(
        { error: "Verify token is required" },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL)

    // Create settings table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    console.log("[v0] Settings table ready")

    // Save each setting individually (upsert)
    await sql`
      INSERT INTO settings (key, value, updated_at) 
      VALUES ('WEBHOOK_VERIFY_TOKEN', ${verifyToken}, NOW())
      ON CONFLICT (key) DO UPDATE 
      SET value = EXCLUDED.value, updated_at = NOW()
    `
    
    if (apiKey) {
      await sql`
        INSERT INTO settings (key, value, updated_at) 
        VALUES ('WHATSAPP_API_KEY', ${apiKey}, NOW())
        ON CONFLICT (key) DO UPDATE 
        SET value = EXCLUDED.value, updated_at = NOW()
      `
    }
    
    await sql`
      INSERT INTO settings (key, value, updated_at) 
      VALUES ('WEBHOOK_URL', ${webhookUrl || ''}, NOW())
      ON CONFLICT (key) DO UPDATE 
      SET value = EXCLUDED.value, updated_at = NOW()
    `

    console.log("[v0] Settings saved successfully")

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    })
  } catch (error) {
    console.error("[v0] Error saving settings:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save settings",
      },
      { status: 500 }
    )
  }
}
