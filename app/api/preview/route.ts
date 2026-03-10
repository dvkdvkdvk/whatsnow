import { put, list } from '@vercel/blob'
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { projectName, clientName, prompt, variants, brandCSS, tokens } = data
    
    // Generate a unique preview ID
    const previewId = nanoid(12)
    
    // Store the preview data as JSON in Blob
    const blob = await put(`previews/${previewId}.json`, JSON.stringify({
      projectName,
      clientName,
      prompt,
      variants,
      brandCSS: brandCSS || '',
      tokens: tokens || {},
      createdAt: Date.now(),
    }), {
      access: 'public',
      contentType: 'application/json',
    })
    
    // Return both the ID and the blob URL for direct access
    return Response.json({ success: true, previewId, blobUrl: blob.url })
  } catch (error) {
    console.error('Failed to create preview:', error)
    return Response.json({ error: 'Failed to create preview' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const previewId = url.searchParams.get('id')
  
  if (!previewId) {
    return Response.json({ error: 'Preview ID required' }, { status: 400 })
  }
  
  try {
    // List blobs to find the one matching our preview ID
    const { blobs } = await list({ prefix: `previews/${previewId}` })
    
    if (blobs.length === 0) {
      return Response.json({ error: 'Preview not found' }, { status: 404 })
    }
    
    // Fetch the preview data from the blob URL
    const response = await fetch(blobs[0].url)
    
    if (!response.ok) {
      return Response.json({ error: 'Preview not found' }, { status: 404 })
    }
    
    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error('Failed to fetch preview:', error)
    return Response.json({ error: 'Preview not found or expired' }, { status: 404 })
  }
}
