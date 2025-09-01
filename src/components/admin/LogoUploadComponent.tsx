'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'

interface LogoUploadComponentProps {
  currentLogo?: string
  onLogoChange: (logoUrl: string) => void
  label?: string
  className?: string
}

export default function LogoUploadComponent({
  currentLogo,
  onLogoChange,
  label = "Bedrijfslogo",
  className = ""
}: LogoUploadComponentProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError(null)

    // Client-side validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Alleen JPG, PNG, WebP en SVG bestanden zijn toegestaan.')
      setIsUploading(false)
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setUploadError('Bestand te groot. Maximum grootte is 5MB.')
      setIsUploading(false)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        onLogoChange(result.url)
        setPreviewUrl(null) // Clear preview since we now have the uploaded URL
      } else {
        setUploadError(result.error || 'Upload failed')
        setPreviewUrl(null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Er is een fout opgetreden bij het uploaden.')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const displayLogo = previewUrl || currentLogo

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Current/Preview Logo Display */}
      {displayLogo && (
        <div className="mb-4">
          <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <Image
              src={displayLogo}
              alt="Bedrijfslogo preview"
              fill
              className="object-contain p-2"
              sizes="128px"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {previewUrl ? 'Preview van nieuw logo' : 'Huidig logo'}
          </p>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && document.getElementById('logo-upload')?.click()}
      >
        <input
          id="logo-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
            <p className="text-sm text-gray-600">Uploaden...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-8 h-8 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold text-green-600">Klik om te uploaden</span> of sleep een bestand hierheen
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, WebP, SVG (max. 5MB)
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {uploadError}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500 mt-2">
        Upload een bedrijfslogo voor optimale weergave in de spotlight sectie.
      </p>
    </div>
  )
}