import { put } from '@vercel/blob'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Limit file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    // Get file extension
    const ext = file.name.split('.').pop() || 'png'
    const filename = `screenshots/${Date.now()}-visual-ref.${ext}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    })

    return Response.json({
      success: true,
      url: blob.url,
    })
  } catch (error) {
    console.error('Upload screenshot error:', error)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
