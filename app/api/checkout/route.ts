import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    const apiKey = process.env.LEMON_SQUEEZY_API_KEY
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID
    const productId = process.env.LEMON_SQUEEZY_PRODUCT_ID

    if (!apiKey || !storeId || !productId) {
      console.error("[v0] Missing Lemon Squeezy credentials")
      return NextResponse.json(
        { error: "Payment configuration not available" },
        { status: 500 }
      )
    }

    // Create checkout link via Lemon Squeezy API
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              custom: {
                user_id: userId,
              },
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: storeId,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: productId,
              },
            },
          },
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Lemon Squeezy error:", error)
      return NextResponse.json(
        { error: "Failed to create checkout" },
        { status: response.status }
      )
    }

    const data = await response.json()
    const checkoutUrl = data.data.attributes.url

    console.log("[v0] Checkout created:", checkoutUrl)

    return NextResponse.json({
      success: true,
      checkoutUrl,
    })
  } catch (error) {
    console.error("[v0] Error creating checkout:", error)
    return NextResponse.json(
      { error: "Failed to process upgrade" },
      { status: 500 }
    )
  }
}
