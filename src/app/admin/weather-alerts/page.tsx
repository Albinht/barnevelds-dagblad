'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface WeatherAlert {
  id: string
  type: string
  message: string
  severity: string
  active: boolean
  startDate: string
  endDate: string
}

export default function AdminWeatherAlertsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAlert, setEditingAlert] = useState<WeatherAlert | null>(null)
  const [formData, setFormData] = useState({
    type: '',
    message: '',
    severity: '',
    active: true,
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/admin/weather-alerts')
      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts || [])
      }
    } catch (error) {
      console.error('Error fetching weather alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingAlert
        ? `/api/admin/weather-alerts/${editingAlert.id}`
        : '/api/admin/weather-alerts'

      const response = await fetch(url, {
        method: editingAlert ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchAlerts()
        setShowForm(false)
        setEditingAlert(null)
        setFormData({
          type: '',
          message: '',
          severity: '',
          active: true,
          startDate: '',
          endDate: ''
        })
      }
    } catch (error) {
      console.error('Error saving weather alert:', error)
    }
  }

  const handleEdit = (alert: WeatherAlert) => {
    setEditingAlert(alert)
    setFormData({
      type: alert.type,
      message: alert.message,
      severity: alert.severity,
      active: alert.active,
      startDate: alert.startDate.split('T')[0],
      endDate: alert.endDate.split('T')[0]
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze weerwaarschuwing wilt verwijderen?')) return

    try {
      const response = await fetch(`/api/admin/weather-alerts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchAlerts()
      }
    } catch (error) {
      console.error('Error deleting weather alert:', error)
    }
  }

  const handleToggleActive = async (alert: WeatherAlert) => {
    try {
      const response = await fetch(`/api/admin/weather-alerts/${alert.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...alert, active: !alert.active }),
      })

      if (response.ok) {
        await fetchAlerts()
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
      case 'heat': return 'Hitte'
      case 'cold': return 'Koude'
      case 'wind': return 'Wind'
      case 'storm': return 'Storm'
      case 'rain': return 'Regen'
      case 'snow': return 'Sneeuw'
      case 'ice': return 'IJzel'
      case 'fog': return 'Mist'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Weerwaarschuwingen Beheer</h1>
        <div className="flex gap-4">
          <Link href="/admin" className="text-blue-600 hover:underline">
            ← Terug naar Admin
          </Link>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingAlert(null)
              setFormData({
                type: '',
                message: '',
                severity: '',
                active: true,
                startDate: '',
                endDate: ''
              })
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Nieuwe Weerwaarschuwing
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingAlert ? 'Weerwaarschuwing Bewerken' : 'Nieuwe Weerwaarschuwing'}
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
                  <option value="heat">Hitte</option>
                  <option value="cold">Koude</option>
                  <option value="wind">Wind</option>
                  <option value="storm">Storm</option>
                  <option value="rain">Regen</option>
                  <option value="snow">Sneeuw</option>
                  <option value="ice">IJzel</option>
                  <option value="fog">Mist</option>
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
                  <option value="low">Laag (Geel)</option>
                  <option value="medium">Medium (Oranje)</option>
                  <option value="high">Hoog (Rood)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waarschuwingsbericht *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="bijv. Zware storm verwacht met windstoten tot 120 km/u"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Startdatum *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Einddatum *
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
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
                {editingAlert ? 'Opslaan' : 'Toevoegen'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingAlert(null)
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
                Bericht
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
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {getTypeLabel(alert.type)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {alert.message}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(alert.severity)}`}>
                    {alert.severity === 'low' ? 'Geel' : alert.severity === 'medium' ? 'Oranje' : 'Rood'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="text-xs">
                    {new Date(alert.startDate).toLocaleString('nl-NL')}
                  </div>
                  <div className="text-xs">
                    tot {new Date(alert.endDate).toLocaleString('nl-NL')}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleToggleActive(alert)}
                    className={`px-2 py-1 rounded text-xs ${
                      alert.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {alert.active ? 'Actief' : 'Inactief'}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(alert)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Bewerk
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Verwijder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {alerts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Geen weerwaarschuwingen gevonden
          </div>
        )}
      </div>
    </div>
  )
}