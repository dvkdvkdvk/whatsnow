import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { z } from "zod"

const sql = neon(process.env.DATABASE_URL!)

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = signUpSchema.parse(body)

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM profiles WHERE email = ${email.toLowerCase()}
    `

    if (existing.length > 0) {
      return Response.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const result = await sql`
      INSERT INTO profiles (email, password_hash)
      VALUES (${email.toLowerCase()}, ${passwordHash})
      RETURNING id, email
    `

    return Response.json(
      {
        message: "Account created successfully",
        user: result[0],
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid input" },
        { status: 400 }
      )
    }

    console.error("[v0] Sign up error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Sign up failed" },
      { status: 500 }
    )
  }
}
