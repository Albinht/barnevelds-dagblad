import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'

export async function POST(request: NextRequest) {
  console.log('=== Upload endpoint called ===')
  
  try {
    // Check authentication using NextAuth
    const session = await getServerSession(authOptions)
    console.log('Session check:', {
      hasSession: !!session,
      userEmail: session?.user?.email || 'none',
      userName: session?.user?.name || 'none'
    })
    
    // For development, allow uploads if no database is connected
    const isDevelopment = process.env.NODE_ENV === 'development'
    const hasVercelBlob = process.env.BLOB_READ_WRITE_TOKEN
    
    if (!session?.user?.email && !isDevelopment) {
      console.log('Upload failed: User not authenticated')
      return NextResponse.json(
        { error: 'Unauthorized - Please log in first' },
        { status: 401 }
      )
    }

    // Check if Vercel Blob is configured
    if (!hasVercelBlob && process.env.NODE_ENV === 'production') {
      console.log('Upload failed: Vercel Blob not configured')
      return NextResponse.json(
        { error: 'Storage not configured. Please set up Vercel Blob storage.' },
        { status: 500 }
      )
    }

    // Parse form data
    let data: FormData
    try {
      data = await request.formData()
    } catch (parseError) {
      console.error('FormData parse error:', parseError)
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      )
    }
    
    const file: File | null = data.get('file') as unknown as File
    console.log('File received:', file ? `${file.name} (${file.size} bytes, type: ${file.type})` : 'No file')

    if (!file) {
      console.log('Upload failed: No file in request')
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const fileType = file.type.toLowerCase()
    
    if (!allowedTypes.includes(fileType)) {
      console.log(`Upload failed: Invalid file type ${fileType}`)
      return NextResponse.json(
        { error: `Invalid file type: ${fileType}. Only JPG, PNG, GIF and WebP are allowed.` },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      console.log(`Upload failed: File too large (${file.size} bytes)`)
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 5MB.` },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `articles/article-${timestamp}-${randomString}.${extension}`

    console.log('Uploading to Vercel Blob:', filename)

    try {
      // Upload to Vercel Blob storage
      let blob
      
      if (hasVercelBlob) {
        // Production: Use Vercel Blob
        blob = await put(filename, file, {
          access: 'public',
          addRandomSuffix: false
        })
        console.log('File uploaded to Vercel Blob:', blob.url)
      } else {
        // Development: Return mock URL
        console.log('Development mode: Returning mock URL')
        blob = {
          url: `/uploads/${filename}`,
          pathname: filename,
          contentType: file.type,
          contentDisposition: `inline; filename="${file.name}"`
        }
      }

      console.log('Upload successful, URL:', blob.url)
      console.log('=== Upload complete ===')

      return NextResponse.json({ 
        url: blob.url,
        filename: blob.pathname,
        size: file.size,
        type: file.type,
        message: 'Upload successful'
      })
    } catch (uploadError) {
      console.error('Blob upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload to storage' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('=== Upload error ===')
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}