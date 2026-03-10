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

    // Use a screenshot service - we'll use screenshotone.com API
    // Alternative: use Puppeteer/Playwright in a serverless function
    const screenshotApiUrl = `https://api.screenshotone.com/take?url=${encodeURIComponent(parsedUrl.toString())}&viewport_width=1440&viewport_height=900&format=png&block_ads=true&block_cookie_banners=true&full_page=false`
    
    // For now, we'll use a free alternative - microlink.io
    const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(parsedUrl.toString())}&screenshot=true&meta=false&embed=screenshot.url`
    
    try {
      const response = await fetch(microlinkUrl)
      const data = await response.json()
      
      if (data.status === 'success' && data.data?.screenshot?.url) {
        // Download the screenshot and store in Blob
        const screenshotResponse = await fetch(data.data.screenshot.url)
        const screenshotBuffer = await screenshotResponse.arrayBuffer()
        
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
      }
      
      return Response.json({ error: 'Failed to capture screenshot' }, { status: 500 })
    } catch (screenshotError) {
      console.error('Screenshot error:', screenshotError)
      return Response.json({ error: 'Screenshot service unavailable' }, { status: 500 })
    }
  } catch (error) {
    console.error('Screenshot route error:', error)
    return Response.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
