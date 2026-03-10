import { neon } from "@neondatabase/serverless"
import { z } from "zod"

const sql = neon(process.env.DATABASE_URL!)

const webhookSchema = z.object({
  object: z.literal("whatsapp_business_account"),
  entry: z.array(
    z.object({
      id: z.string(),
      changes: z.array(
        z.object({
          value: z.object({
            messaging_product: z.literal("whatsapp"),
            messages: z
              .array(
                z.object({
                  from: z.string(),
                  id: z.string(),
                  timestamp: z.string(),
                  text: z.object({
                    body: z.string(),
                  }),
                })
              )
              .optional(),
          }),
        })
      ),
    })
  ),
})

// Verify webhook token
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  console.log("[v0] Webhook verification attempt:")
  console.log("[v0] Mode:", mode)
  console.log("[v0] Token received:", token)
  console.log("[v0] Token expected:", process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN)
  console.log("[v0] Challenge:", challenge)
  console.log("[v0] Tokens match:", token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN)

  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log("[v0] ✅ Webhook verified successfully")
    return new Response(challenge, { 
      status: 200,
      headers: { "Content-Type": "text/plain" }
    })
  }

  console.error("[v0] ❌ Webhook verification failed - token mismatch or invalid mode")
  console.error("[v0] Expected mode: subscribe, got:", mode)
  console.error("[v0] Token match:", token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN)
  return new Response("Forbidden", { status: 403 })
}

// Handle incoming messages
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = webhookSchema.parse(body)

    // Process each message
    for (const entry of validated.entry) {
      for (const change of entry.changes) {
        const messages = change.value.messages
        if (!messages) continue

        for (const message of messages) {
          const phoneNumber = message.from
          const incomingText = message.text.body

          // Get automation settings for this phone number
          const settings = await sql`
            SELECT id, user_id, knowledge_base FROM automation_settings 
            WHERE phone_number = ${phoneNumber} AND enabled = true
          `

          if (settings.length === 0) continue

          const setting = settings[0]

          // Generate AI response
          const aiResponse = await generateAIResponse(
            incomingText,
            setting.knowledge_base || ""
          )

          // Store message in database
          await sql`
            INSERT INTO messages (automation_id, phone_number, incoming_message, outgoing_message, status)
            VALUES (${setting.id}, ${phoneNumber}, ${incomingText}, ${aiResponse}, 'sent')
          `

          // TODO: Send message back to WhatsApp using Meta API
          console.log(`[v0] Response for ${phoneNumber}: ${aiResponse}`)
        }
      }
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return Response.json({ error: "Processing failed" }, { status: 500 })
  }
}

async function generateAIResponse(userMessage: string, knowledgeBase: string): Promise<string> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful WhatsApp business assistant. Keep responses brief (1-2 sentences). ${
              knowledgeBase ? `Use this context: ${knowledgeBase}` : ""
            }`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>
    }
    return data.choices[0]?.message?.content || "I'm unable to respond right now. Please try again later."
  } catch (error) {
    console.error("AI generation error:", error)
    return "I'm unable to process your message. Please try again."
  }
}
