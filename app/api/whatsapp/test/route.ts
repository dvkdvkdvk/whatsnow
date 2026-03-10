export async function GET() {
  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
  
  return Response.json({
    message: "Webhook test endpoint",
    webhookUrl: "https://vm-rtc2fcmkc0nmqkl5xzq7x5.vusercontent.net/api/whatsapp/webhook",
    verifyTokenSet: !!verifyToken,
    verifyTokenValue: verifyToken ? "***" : "NOT SET - using default 886464",
    testUrl: "https://vm-rtc2fcmkc0nmqkl5xzq7x5.vusercontent.net/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=886464&hub.challenge=test123"
  })
}
