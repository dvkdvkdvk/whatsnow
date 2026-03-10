import { put } from '@vercel/blob'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return Response.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return Response.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Try multiple screenshot services with fallbacks
    const screenshotServices = [
      // 1. Try screenshotapi.net (has free tier)
      async () => {
        const apiUrl = `https://screenshot.screenshotapi.net/screenshot?url=${encodeURIComponent(parsedUrl.toString())}&width=1440&height=900`
        const response = await fetch(apiUrl, { timeout: 5000 })
        if (response.ok) {
          return response.arrayBuffer()
        }
        return null
      },
      // 2. Try microlink.io
      async () => {
        const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(parsedUrl.toString())}&screenshot=true&meta=false`
        const response = await fetch(apiUrl, { timeout: 5000 })
        const data = await response.json()
        if (data.status === 'success' && data.data?.screenshot?.url) {
          const screenshotResponse = await fetch(data.data.screenshot.url)
          return screenshotResponse.arrayBuffer()
        }
        return null
      },
      // 3. Fallback: create a placeholder with client info
      async () => {
        // Since external screenshot services are unreliable, 
        // we'll just store the URL and let the AI work with just CSS tokens
        return null
      }
    ]

    let screenshotBuffer = null
    for (const service of screenshotServices) {
      try {
        screenshotBuffer = await service()
        if (screenshotBuffer) break
      } catch (e) {
        // Try next service
        console.error('Screenshot service failed:', e)
      }
    }

    // If no screenshot could be captured, return just the URL
    // The AI will still work with the CSS tokens extracted from the page
    if (!screenshotBuffer) {
      return Response.json({
        success: true,
        screenshotUrl: null,
        message: 'Screenshot unavailable - AI will use CSS tokens only',
        originalUrl: parsedUrl.toString(),
      })
    }

    // Store in Vercel Blob
    const filename = `screenshots/${Date.now()}-${parsedUrl.hostname}.png`
    const blob = await put(filename, screenshotBuffer, {
      access: 'public',
      contentType: 'image/png',
    })

    return Response.json({
      success: true,
      screenshotUrl: blob.url,
      originalUrl: parsedUrl.toString(),
    })
  } catch (error) {
    console.error('Screenshot route error:', error)
    return Response.json({ 
      error: 'Screenshot service temporarily unavailable', 
      message: 'The tool will still work using CSS tokens from the imported URL'
    }, { status: 500 })
  }
}
