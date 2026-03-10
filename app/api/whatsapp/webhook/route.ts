// Verify webhook token - Meta sends GET request to validate
export async function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get("hub.mode")
  const token = url.searchParams.get("hub.verify_token")
  const challenge = url.searchParams.get("hub.challenge")

  // Hardcode the token to ensure it works
  const VERIFY_TOKEN = "886464"

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    // Return ONLY the challenge string with 200 status
    return new Response(challenge || "", { status: 200 })
  }

  return new Response("Forbidden", { status: 403 })
}

// Handle incoming messages from WhatsApp
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Log incoming webhook for debugging
    console.log("Received webhook:", JSON.stringify(body, null, 2))
    
    // Always return 200 to acknowledge receipt
    return new Response("OK", { status: 200 })
  } catch (error) {
    console.error("Webhook POST error:", error)
    return new Response("Error", { status: 500 })
  }
}
