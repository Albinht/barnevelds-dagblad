'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface HistoricalStory {
  id: string
  title: string
  excerpt: string
  content: string
  period: string
  year: string
  image?: string
  tags: string[]
  published: boolean
}

const periods = [
  { value: 'middeleeuwen', label: 'Middeleeuwen', period: 'Voor 1500' },
  { value: 'gouden-eeuw', label: 'Gouden Eeuw', period: '1500-1700' },
  { value: '18e-eeuw', label: '18e Eeuw', period: '1700-1800' },
  { value: '19e-eeuw', label: '19e Eeuw', period: '1800-1900' },
  { value: '20e-eeuw', label: '20e Eeuw', period: '1900-2000' },
  { value: 'modern', label: 'Recent verleden', period: '2000-heden' }
]

export default function AdminHistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stories, setStories] = useState<HistoricalStory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStory, setEditingStory] = useState<HistoricalStory | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    period: '',
    year: '',
    image: '',
    tags: [] as string[],
    published: true
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/admin/history')
      if (response.ok) {
        const data = await response.json()
        setStories(data.stories || [])
      }
    } catch (error) {
      console.error('Error fetching historical stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingStory
        ? `/api/admin/history/${editingStory.id}`
        : '/api/admin/history'

      const response = await fetch(url, {
        method: editingStory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchStories()
        setShowForm(false)
        setEditingStory(null)
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          period: '',
          year: '',
          image: '',
          tags: [],
          published: true
        })
        setTagInput('')
      }
    } catch (error) {
      console.error('Error saving historical story:', error)
    }
  }

  const handleEdit = (story: HistoricalStory) => {
    setEditingStory(story)
    setFormData({
      title: story.title,
      excerpt: story.excerpt,
      content: story.content,
      period: story.period,
      year: story.year,
      image: story.image || '',
      tags: story.tags,
      published: story.published
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit historische verhaal wilt verwijderen?')) return

    try {
      const response = await fetch(`/api/admin/history/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchStories()
      }
    } catch (error) {
      console.error('Error deleting historical story:', error)
    }
  }

  const handleTogglePublished = async (story: HistoricalStory) => {
    try {
      const response = await fetch(`/api/admin/history/${story.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...story, published: !story.published }),
      })

      if (response.ok) {
        await fetchStories()
      }
    } catch (error) {
      console.error('Error toggling published status:', error)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
  }

  const getPeriodLabel = (value: string) => {
    const period = periods.find(p => p.value === value)
    return period ? period.label : value
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Historie Beheer</h1>
        <div className="flex gap-4">
          <Link href="/admin" className="text-blue-600 hover:underline">
            ← Terug naar Admin
          </Link>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingStory(null)
              setFormData({
                title: '',
                excerpt: '',
                content: '',
                period: '',
                year: '',
                image: '',
                tags: [],
                published: true
              })
              setTagInput('')
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Nieuw Historisch Verhaal
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingStory ? 'Historisch Verhaal Bewerken' : 'Nieuw Historisch Verhaal'}
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
                  Periode *
                </label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecteer periode</option>
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>
                      {period.label} ({period.period})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jaar/Periode *
                </label>
                <input
                  type="text"
                  placeholder="bijv. 13e eeuw, 1899, 1900-1950"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Samenvatting *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volledig Verhaal *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={8}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Voeg een tag toe"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Toevoegen
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-600 hover:text-gray-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
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
                {editingStory ? 'Opslaan' : 'Toevoegen'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingStory(null)
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
                Periode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Jaar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tags
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
            {stories.map((story) => (
              <tr key={story.id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {story.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {getPeriodLabel(story.period)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {story.year}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex flex-wrap gap-1">
                    {story.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {story.tags.length > 3 && (
                      <span className="text-xs text-gray-400">+{story.tags.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleTogglePublished(story)}
                    className={`px-2 py-1 rounded text-xs ${
                      story.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {story.published ? 'Gepubliceerd' : 'Concept'}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(story)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Bewerk
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Verwijder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {stories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Geen historische verhalen gevonden
          </div>
        )}
      </div>
    </div>
  )
}