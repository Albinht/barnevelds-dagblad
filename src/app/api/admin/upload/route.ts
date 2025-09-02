import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'

export async function POST(request: NextRequest) {
  console.log('Upload endpoint called')
  
  try {
    // Check authentication using NextAuth
    const session = await getServerSession(authOptions)
    console.log('Session:', session?.user?.email ? 'Authenticated' : 'Not authenticated')
    
    if (!session?.user?.email) {
      console.log('Upload failed: User not authenticated')
      return NextResponse.json(
        { error: 'Unauthorized - Please log in first' },
        { status: 401 }
      )
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    console.log('File received:', file ? `${file.name} (${file.size} bytes)` : 'No file')

    if (!file) {
      console.log('Upload failed: No file in request')
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' },
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
    const extension = path.extname(file.name).toLowerCase() || '.jpg'
    const filename = `article-${timestamp}-${randomString}${extension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create the uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'articles')
    const { mkdir } = await import('fs/promises')
    await mkdir(uploadDir, { recursive: true })

    // Save the file
    const filepath = path.join(uploadDir, filename)
    console.log('Saving file to:', filepath)
    await writeFile(filepath, buffer)
    console.log('File saved successfully')

    // Return the public URL
    const url = `/uploads/articles/${filename}`
    console.log('Upload successful, URL:', url)

    return NextResponse.json({ 
      url,
      filename,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Upload error details:', {
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