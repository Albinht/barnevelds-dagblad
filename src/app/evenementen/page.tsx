'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  image?: string
  category: string
  organizer: string
  price?: string
  website?: string
}

export default function EvenementenPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [showPastEvents, setShowPastEvents] = useState(false)

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/events')
        const data = await response.json()

        if (data.success && data.events) {
          setEvents(data.events)
        } else {
          setError('Geen evenementen gevonden')
        }
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Fout bij het laden van evenementen')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Filter events based on selected criteria
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    const now = new Date()

    // Filter by past/future
    if (!showPastEvents && eventDate < now) {
      return false
    }

    // Filter by category
    if (selectedCategory !== 'all' && event.category !== selectedCategory) {
      return false
    }

    // Filter by month
    if (selectedMonth !== 'all') {
      const eventMonth = eventDate.getMonth() + 1
      if (eventMonth !== parseInt(selectedMonth)) {
        return false
      }
    }

    return true
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'cultuur': 'bg-purple-100 text-purple-800',
      'sport': 'bg-green-100 text-green-800',
      'markt': 'bg-yellow-100 text-yellow-800',
      'festival': 'bg-pink-100 text-pink-800',
      'muziek': 'bg-blue-100 text-blue-800',
      'workshop': 'bg-indigo-100 text-indigo-800',
      'overig': 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors['overig']
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Evenementen laden...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Evenementen in Barneveld</h1>
        <p className="text-xl text-gray-600">
          Ontdek wat er te doen is in Barneveld en omgeving
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Alle categorieën</option>
              <option value="cultuur">Cultuur</option>
              <option value="sport">Sport</option>
              <option value="markt">Markt</option>
              <option value="festival">Festival</option>
              <option value="muziek">Muziek</option>
              <option value="workshop">Workshop</option>
              <option value="overig">Overig</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maand
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Alle maanden</option>
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maart</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">Augustus</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPastEvents}
                onChange={(e) => setShowPastEvents(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Toon verlopen evenementen</span>
            </label>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Geen evenementen gevonden</h3>
          <p className="mt-1 text-sm text-gray-500">
            {events.length === 0
              ? 'Er zijn momenteel geen evenementen gepubliceerd.'
              : 'Pas je filters aan om evenementen te zien.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {event.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                  {event.price && (
                    <span className="text-sm font-medium text-gray-900">
                      {event.price}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {event.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {event.organizer}
                  </div>
                </div>

                {event.website && (
                  <div className="mt-4">
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Meer informatie →
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Organiseer je een evenement?
        </h2>
        <p className="text-gray-600 mb-6">
          Wil je jouw evenement ook op deze pagina? Neem contact met ons op!
        </p>
        <Link
          href="/contact?subject=evenement"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Evenement aanmelden
        </Link>
      </div>
    </div>
  )
}