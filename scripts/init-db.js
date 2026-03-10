import { neon } from "@neondatabase/serverless"

async function initDb() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    console.log("[v0] Creating profiles table...")
    
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        otp_code VARCHAR(6),
        otp_expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    console.log("[v0] Creating indexes...")
    
    await sql`CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone_number)`
    await sql`CREATE INDEX IF NOT EXISTS idx_profiles_otp ON profiles(otp_code)`
    
    console.log("[v0] Database initialized successfully!")
  } catch (error) {
    console.error("[v0] Database initialization error:", error)
    process.exit(1)
  }
}

initDb()
