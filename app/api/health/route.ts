import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Health check endpoint called")
    console.log("[v0] DATABASE_URL:", !!process.env.DATABASE_URL)
    
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`SELECT 1 as health`
    
    return NextResponse.json({ 
      status: "ok",
      database: "connected",
      result
    })
  } catch (error) {
    console.error("[v0] Health check error:", error)
    return NextResponse.json({ 
      status: "error",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
