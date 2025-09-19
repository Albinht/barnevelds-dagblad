'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TrafficInfo {
  id: string
  type: string
  location: string
  description: string
  severity: string
  startDate?: string
  endDate?: string
  active: boolean
}

export default function AdminTrafficPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trafficInfos, setTrafficInfos] = useState<TrafficInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingInfo, setEditingInfo] = useState<TrafficInfo | null>(null)
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    description: '',
    severity: '',
    startDate: '',
    endDate: '',
    active: true
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchTrafficInfo()
  }, [])

  const fetchTrafficInfo = async () => {
    try {
      const response = await fetch('/api/admin/traffic')
      if (response.ok) {
        const data = await response.json()
        setTrafficInfos(data.trafficInfos || [])
      }
    } catch (error) {
      console.error('Error fetching traffic info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingInfo
        ? `/api/admin/traffic/${editingInfo.id}`
        : '/api/admin/traffic'

      const response = await fetch(url, {
        method: editingInfo ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null
        }),
      })

      if (response.ok) {
        await fetchTrafficInfo()
        setShowForm(false)
        setEditingInfo(null)
        setFormData({
          type: '',
          location: '',
          description: '',
          severity: '',
          startDate: '',
          endDate: '',
          active: true
        })
      }
    } catch (error) {
      console.error('Error saving traffic info:', error)
    }
  }

  const handleEdit = (info: TrafficInfo) => {
    setEditingInfo(info)
    setFormData({
      type: info.type,
      location: info.location,
      description: info.description,
      severity: info.severity,
      startDate: info.startDate ? info.startDate.split('T')[0] : '',
      endDate: info.endDate ? info.endDate.split('T')[0] : '',
      active: info.active
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze verkeersinformatie wilt verwijderen?')) return

    try {
      const response = await fetch(`/api/admin/traffic/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchTrafficInfo()
      }
    } catch (error) {
      console.error('Error deleting traffic info:', error)
    }
  }

  const handleToggleActive = async (info: TrafficInfo) => {
    try {
      const response = await fetch(`/api/admin/traffic/${info.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...info, active: !info.active }),
      })

      if (response.ok) {
        await fetchTrafficInfo()
      }
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'wegwerkzaamheden': return 'Wegwerkzaamheden'
      case 'file': return 'File'
      case 'ongeval': return 'Ongeval'
      case 'waarschuwing': return 'Waarschuwing'
      default: return type
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Verkeersinformatie Beheer</h1>
        <div className="flex gap-4">
          <Link href="/admin" className="text-blue-600 hover:underline">
            ← Terug naar Admin
          </Link>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingInfo(null)
              setFormData({
                type: '',
                location: '',
                description: '',
                severity: '',
                startDate: '',
                endDate: '',
                active: true
              })
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Nieuwe Verkeersinformatie
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingInfo ? 'Verkeersinformatie Bewerken' : 'Nieuwe Verkeersinformatie'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecteer type</option>
                  <option value="wegwerkzaamheden">Wegwerkzaamheden</option>
                  <option value="file">File</option>
                  <option value="ongeval">Ongeval</option>
                  <option value="waarschuwing">Waarschuwing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ernst *
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecteer ernst</option>
                  <option value="low">Laag</option>
                  <option value="medium">Medium</option>
                  <option value="high">Hoog</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Locatie *
              </label>
              <input
                type="text"
                placeholder="bijv. A1 Barneveld - Apeldoorn"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschrijving *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Startdatum
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Einddatum
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">Actief</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingInfo ? 'Opslaan' : 'Toevoegen'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingInfo(null)
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
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Locatie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ernst
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Periode
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
            {trafficInfos.map((info) => (
              <tr key={info.id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {getTypeLabel(info.type)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {info.location}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(info.severity)}`}>
                    {info.severity === 'low' ? 'Laag' : info.severity === 'medium' ? 'Medium' : 'Hoog'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {info.startDate && new Date(info.startDate).toLocaleDateString('nl-NL')}
                  {info.endDate && ` - ${new Date(info.endDate).toLocaleDateString('nl-NL')}`}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleToggleActive(info)}
                    className={`px-2 py-1 rounded text-xs ${
                      info.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {info.active ? 'Actief' : 'Inactief'}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(info)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Bewerk
                  </button>
                  <button
                    onClick={() => handleDelete(info.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Verwijder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {trafficInfos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Geen verkeersinformatie gevonden
          </div>
        )}
      </div>
    </div>
  )
}