'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Bedrijf {
  id: string
  naam: string
  beschrijving: string
  categorie: string
  adres: string
  telefoon?: string
  website?: string
  logo: string
  featured: boolean
  label: 'PREMIUM' | 'NIEUW' | null
  timestamp: number
}

export default function BedrijvenManagePage() {
  const [bedrijven, setBedrijven] = useState<Bedrijf[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const categories = [
    'Horeca', 'Winkel', 'Dienstverlening', 'Bouw & Constructie',
    'Gezondheid & Welzijn', 'Auto & Transport', 'Sport & Recreatie',
    'Onderwijs', 'Overig'
  ]

  useEffect(() => {
    fetchBedrijven()
  }, [])

  const fetchBedrijven = async () => {
    try {
      const response = await fetch('/api/bedrijven')
      if (response.ok) {
        const data = await response.json()
        setBedrijven(data.sort((a: Bedrijf, b: Bedrijf) => b.timestamp - a.timestamp))
      }
    } catch (error) {
      console.error('Error fetching bedrijven:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      return
    }

    try {
      const response = await fetch(`/api/bedrijven/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBedrijven(prev => prev.filter(bedrijf => bedrijf.id !== id))
        alert('Bedrijf succesvol verwijderd!')
      } else {
        alert('Fout bij het verwijderen van het bedrijf')
      }
    } catch (error) {
      console.error('Error deleting bedrijf:', error)
      alert('Er is een fout opgetreden')
    } finally {
      setDeleteConfirm(null)
    }
  }

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/bedrijven/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !currentFeatured }),
      })

      if (response.ok) {
        setBedrijven(prev => 
          prev.map(bedrijf => 
            bedrijf.id === id 
              ? { ...bedrijf, featured: !currentFeatured }
              : bedrijf
          )
        )
      } else {
        alert('Fout bij het bijwerken van het bedrijf')
      }
    } catch (error) {
      console.error('Error updating bedrijf:', error)
      alert('Er is een fout opgetreden')
    }
  }

  const filteredBedrijven = bedrijven.filter(bedrijf => {
    const matchesSearch = bedrijf.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bedrijf.beschrijving.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || bedrijf.categorie === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bedrijven Beheren</h1>
          <p className="mt-1 text-sm text-gray-600">
            Bekijk, bewerk en verwijder bedrijfsgegevens
          </p>
        </div>
        <Link
          href="/admin/bedrijf-toevoegen"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Nieuw Bedrijf
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Zoeken
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Zoek op naam of beschrijving..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Filter op categorie
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Alle categorieën</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {filteredBedrijven.length} van {bedrijven.length} bedrijven
        </div>
      </div>

      {/* Business List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredBedrijven.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Geen bedrijven gevonden</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || categoryFilter ? 'Probeer andere zoekfilters.' : 'Begin door een bedrijf toe te voegen.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bedrijf
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBedrijven.map((bedrijf) => (
                  <tr key={bedrijf.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={bedrijf.logo}
                            alt={bedrijf.naam}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium text-gray-900">
                              {bedrijf.naam}
                            </div>
                            {bedrijf.label && (
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                bedrijf.label === 'PREMIUM' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {bedrijf.label}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {bedrijf.beschrijving}
                          </div>
                          <div className="text-xs text-gray-400">
                            {bedrijf.adres}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {bedrijf.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bedrijf.telefoon && (
                        <div>{bedrijf.telefoon}</div>
                      )}
                      {bedrijf.website && (
                        <div className="text-blue-600 hover:text-blue-800">
                          <a href={bedrijf.website} target="_blank" rel="noopener noreferrer">
                            Website
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleFeatured(bedrijf.id, bedrijf.featured)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          bedrijf.featured 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        } transition-colors cursor-pointer`}
                      >
                        {bedrijf.featured ? '⭐ Featured' : 'Featured'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/bedrijven/${bedrijf.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Bewerken
                      </Link>
                      <button
                        onClick={() => handleDelete(bedrijf.id)}
                        className={`${
                          deleteConfirm === bedrijf.id 
                            ? 'text-red-800 bg-red-100 px-2 py-1 rounded' 
                            : 'text-red-600 hover:text-red-900'
                        } transition-colors`}
                      >
                        {deleteConfirm === bedrijf.id ? 'Bevestigen' : 'Verwijderen'}
                      </button>
                      {deleteConfirm === bedrijf.id && (
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Annuleren
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}