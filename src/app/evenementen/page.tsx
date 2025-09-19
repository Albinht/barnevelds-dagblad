'use client'

import { useState } from 'react'
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
  category: 'cultuur' | 'sport' | 'markt' | 'festival' | 'overig'
  organizer: string
  price?: string
  website?: string
}

// Sample events data
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Weekmarkt Barneveld',
    date: '2024-01-20',
    time: '08:00 - 13:00',
    location: 'Centrum Barneveld',
    description: 'De wekelijkse markt met vers fruit, groente, vis, bloemen en meer.',
    category: 'markt',
    organizer: 'Gemeente Barneveld',
    price: 'Gratis toegang'
  },
  {
    id: '2',
    title: 'Oud Veluwse Markt',
    date: '2024-07-15',
    time: '10:00 - 17:00',
    location: 'Oude Kerk, Barneveld',
    description: 'Jaarlijkse historische markt met ambachten, oude gebruiken en traditionele kleding.',
    category: 'cultuur',
    organizer: 'Historische Vereniging Barneveld',
    price: 'Gratis toegang',
    website: 'https://www.oudveluwsemarkt.nl'
  },
  {
    id: '3',
    title: 'Barneveld Sport Festival',
    date: '2024-06-10',
    time: '09:00 - 18:00',
    location: 'Sportpark De Veluwehal',
    description: 'Een dag vol sport en beweging voor jong en oud. Probeer verschillende sporten uit!',
    category: 'sport',
    organizer: 'Sport Barneveld',
    price: '€ 5,- per persoon'
  }
]

export default function EvenementenPage() {
  const [events] = useState<Event[]>(sampleEvents)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [showPastEvents, setShowPastEvents] = useState(false)

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
    switch (category) {
      case 'cultuur': return 'bg-purple-600'
      case 'sport': return 'bg-green-600'
      case 'markt': return 'bg-orange-600'
      case 'festival': return 'bg-pink-600'
      default: return 'bg-gray-600'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cultuur': return 'Cultuur'
      case 'sport': return 'Sport'
      case 'markt': return 'Markt'
      case 'festival': return 'Festival'
      default: return 'Overig'
    }
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-brand-yellow text-black px-4 py-2 rounded-lg flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-lg">Evenementen</span>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">Evenementen in Barneveld</h1>
        <p className="text-base lg:text-xl text-gray-600 max-w-3xl mx-auto">
          Ontdek alle evenementen, activiteiten en gebeurtenissen in Barneveld en omgeving.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categorie
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="all">Alle categorieën</option>
              <option value="cultuur">Cultuur</option>
              <option value="sport">Sport</option>
              <option value="markt">Markt</option>
              <option value="festival">Festival</option>
              <option value="overig">Overig</option>
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
              Maand
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
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

          {/* Show Past Events */}
          <div className="flex items-end">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showPastEvents}
                onChange={(e) => setShowPastEvents(e.target.checked)}
                className="mr-2 h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Toon afgelopen evenementen</span>
            </label>
          </div>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredEvents.map((event) => (
            <article key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {/* Event Image */}
              {event.image && (
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              {/* Event Content */}
              <div className="p-6">
                {/* Category */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-block ${getCategoryColor(event.category)} text-white px-2 py-1 text-xs font-bold rounded uppercase tracking-wide`}>
                    {getCategoryLabel(event.category)}
                  </span>
                </div>

                {/* Event Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {event.title}
                </h2>

                {/* Event Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                  {event.price && (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{event.price}</span>
                    </div>
                  )}
                </div>

                {/* Event Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Event Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>Organisator: {event.organizer}</span>
                  {event.website && (
                    <a href={event.website} target="_blank" rel="noopener noreferrer"
                       className="text-brand-blue hover:underline">
                      Meer info →
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Geen evenementen gevonden</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Er zijn geen evenementen die voldoen aan uw zoekcriteria. Probeer andere filters of bekijk alle evenementen.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all')
              setSelectedMonth('all')
              setShowPastEvents(false)
            }}
            className="inline-flex items-center bg-brand-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Submit Event Form */}
      <div className="bg-brand-yellow/10 border border-brand-yellow rounded-lg p-6 mt-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              Evenement aanmelden
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Organiseert u een evenement in Barneveld? Meld het aan en bereik duizenden inwoners via Barnevelds Dagblad.
            </p>
            <div className="mt-3">
              <Link href="/contact?subject=evenement"
                    className="inline-flex items-center text-brand-blue hover:underline font-semibold">
                Evenement aanmelden →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}