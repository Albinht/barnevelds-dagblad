'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function DesktopSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/zoeken?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Icon Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="ml-6 text-white hover:text-brand-yellow transition-colors"
        aria-label="Toggle search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <form onSubmit={handleSearch} className="p-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoeken..."
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-blue"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-blue"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="px-4 pb-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 mt-3">Populaire zoekopdrachten</p>
            <div className="flex flex-wrap gap-2">
              {['Barneveld', 'Voorthuizen', 'Gemeente', 'Sport', 'Weer', 'Politiek'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    router.push(`/zoeken?q=${encodeURIComponent(term)}`)
                    setIsOpen(false)
                  }}
                  className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}