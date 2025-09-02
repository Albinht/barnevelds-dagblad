import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { getCurrentSession } = await import('@/lib/auth')
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if Vercel Blob is configured
    const hasVercelBlob = process.env.BLOB_READ_WRITE_TOKEN
    
    if (!hasVercelBlob && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Storage not configured. Please set up Vercel Blob storage.' },
        { status: 500 }
      )
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, WebP, and SVG are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `logos/logo-${timestamp}-${randomString}.${extension}`

    try {
      // Upload to Vercel Blob storage
      let blob
      
      if (hasVercelBlob) {
        // Production: Use Vercel Blob
        blob = await put(filename, file, {
          access: 'public',
          addRandomSuffix: false
        })
      } else {
        // Development: Return mock URL
        blob = {
          url: `/uploads/${filename}`,
          pathname: filename
        }
      }

      return NextResponse.json(
        { 
          message: 'Logo uploaded successfully',
          url: blob.url,
          filename: blob.pathname
        },
        { status: 200 }
      )
    } catch (uploadError) {
      console.error('Blob upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload to storage' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Logo upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload logo' },
      { status: 500 }
    )
  }
}