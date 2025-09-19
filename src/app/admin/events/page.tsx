'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  organizer: string
  price?: string
  website?: string
  image?: string
  published: boolean
}

export default function AdminEventsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    organizer: '',
    price: '',
    website: '',
    image: '',
    published: true
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingEvent
        ? `/api/admin/events/${editingEvent.id}`
        : '/api/admin/events'

      const response = await fetch(url, {
        method: editingEvent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchEvents()
        setShowForm(false)
        setEditingEvent(null)
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          category: '',
          organizer: '',
          price: '',
          website: '',
          image: '',
          published: true
        })
      }
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      time: event.time,
      location: event.location,
      category: event.category,
      organizer: event.organizer,
      price: event.price || '',
      website: event.website || '',
      image: event.image || '',
      published: event.published
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit evenement wilt verwijderen?')) return

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchEvents()
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const handleTogglePublished = async (event: Event) => {
    try {
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...event, published: !event.published }),
      })

      if (response.ok) {
        await fetchEvents()
      }
    } catch (error) {
      console.error('Error toggling published status:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Laden...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Evenementen Beheer</h1>
        <div className="flex gap-4">
          <Link href="/admin" className="text-blue-600 hover:underline">
            ← Terug naar Admin
          </Link>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingEvent(null)
              setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                location: '',
                category: '',
                organizer: '',
                price: '',
                website: '',
                image: '',
                published: true
              })
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Nieuw Evenement
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingEvent ? 'Evenement Bewerken' : 'Nieuw Evenement'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titel *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecteer categorie</option>
                  <option value="sport">Sport</option>
                  <option value="cultuur">Cultuur</option>
                  <option value="muziek">Muziek</option>
                  <option value="markt">Markt</option>
                  <option value="festival">Festival</option>
                  <option value="workshop">Workshop</option>
                  <option value="overig">Overig</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschrijving *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Datum *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tijd *
                </label>
                <input
                  type="text"
                  placeholder="bijv. 14:00"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Locatie *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organisator *
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prijs
                </label>
                <input
                  type="text"
                  placeholder="bijv. Gratis of €10"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Afbeelding URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Gepubliceerd</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingEvent ? 'Opslaan' : 'Toevoegen'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingEvent(null)
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Annuleren
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Titel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Datum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Locatie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Categorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acties
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {event.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString('nl-NL')} {event.time}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {event.location}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className="capitalize">{event.category}</span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleTogglePublished(event)}
                    className={`px-2 py-1 rounded text-xs ${
                      event.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.published ? 'Gepubliceerd' : 'Concept'}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Bewerk
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Verwijder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {events.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Geen evenementen gevonden
          </div>
        )}
      </div>
    </div>
  )
}