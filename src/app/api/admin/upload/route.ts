import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import fs from 'fs'

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
    
    if (!session?.user?.email && !isDevelopment) {
      console.log('Upload failed: User not authenticated')
      return NextResponse.json(
        { error: 'Unauthorized - Please log in first' },
        { status: 401 }
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
    const extension = path.extname(file.name).toLowerCase() || '.jpg'
    const filename = `article-${timestamp}-${randomString}${extension}`

    // Convert file to buffer
    let buffer: Buffer
    try {
      const bytes = await file.arrayBuffer()
      buffer = Buffer.from(bytes)
      console.log(`File converted to buffer: ${buffer.length} bytes`)
    } catch (bufferError) {
      console.error('Buffer conversion error:', bufferError)
      return NextResponse.json(
        { error: 'Failed to process file' },
        { status: 500 }
      )
    }

    // Create the uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'articles')
    console.log('Upload directory:', uploadDir)
    
    try {
      // Check if directory exists
      if (!fs.existsSync(uploadDir)) {
        console.log('Creating upload directory...')
        await mkdir(uploadDir, { recursive: true })
        console.log('Upload directory created')
      } else {
        console.log('Upload directory already exists')
      }
    } catch (dirError) {
      console.error('Directory creation error:', dirError)
      return NextResponse.json(
        { error: 'Failed to create upload directory' },
        { status: 500 }
      )
    }

    // Save the file
    const filepath = path.join(uploadDir, filename)
    console.log('Saving file to:', filepath)
    
    try {
      await writeFile(filepath, buffer)
      console.log('File saved successfully')
      
      // Verify file was saved
      if (!fs.existsSync(filepath)) {
        throw new Error('File was not saved properly')
      }
      
      const stats = fs.statSync(filepath)
      console.log(`File verified: ${stats.size} bytes on disk`)
    } catch (writeError) {
      console.error('File write error:', writeError)
      return NextResponse.json(
        { error: 'Failed to save file to disk' },
        { status: 500 }
      )
    }

    // Return the public URL
    const url = `/uploads/articles/${filename}`
    console.log('Upload successful, URL:', url)
    console.log('=== Upload complete ===')

    return NextResponse.json({ 
      url,
      filename,
      size: file.size,
      type: file.type,
      message: 'Upload successful'
    })
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