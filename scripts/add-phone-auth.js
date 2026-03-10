import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function main() {
  console.log("Adding phone authentication columns...")

  // Add phone_number and otp columns to profiles
  await sql`
    ALTER TABLE profiles 
    ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) UNIQUE,
    ADD COLUMN IF NOT EXISTS otp_code VARCHAR(6),
    ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP
  `

  // Create index for phone number lookups
  await sql`
    CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone_number)
  `

  console.log("Phone authentication columns added successfully!")
}

main().catch(console.error)
