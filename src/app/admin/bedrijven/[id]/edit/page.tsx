'use client'

import { useState, useEffect, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import LogoUploadComponent from '@/components/admin/LogoUploadComponent'

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

export default function EditBedrijfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    naam: '',
    beschrijving: '',
    categorie: '',
    adres: '',
    telefoon: '',
    website: '',
    logo: '/barneveldsdagblad.jpeg',
    featured: false,
    label: null as 'PREMIUM' | 'NIEUW' | null,
  })

  const fetchBedrijf = useCallback(async () => {
    try {
      const response = await fetch(`/api/bedrijven/${id}`)
      if (response.ok) {
        const bedrijf: Bedrijf = await response.json()
        setFormData({
          naam: bedrijf.naam,
          beschrijving: bedrijf.beschrijving,
          categorie: bedrijf.categorie,
          adres: bedrijf.adres,
          telefoon: bedrijf.telefoon || '',
          website: bedrijf.website || '',
          logo: bedrijf.logo,
          featured: bedrijf.featured,
          label: bedrijf.label,
        })
      } else if (response.status === 404) {
        alert('Bedrijf niet gevonden')
        router.push('/admin/bedrijven')
      }
    } catch (error) {
      console.error('Error fetching bedrijf:', error)
      alert('Fout bij het ophalen van bedrijfgegevens')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    fetchBedrijf()
  }, [fetchBedrijf])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'label' ? (value === '' ? null : value as 'PREMIUM' | 'NIEUW') :
              value
    }))
  }

  const handleLogoChange = (logoUrl: string) => {
    setFormData(prev => ({
      ...prev,
      logo: logoUrl
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/bedrijven/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await response.json()
        alert('Bedrijf succesvol bijgewerkt!')
        router.push('/admin/bedrijven')
      } else {
        const error = await response.json()
        alert(`Fout: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating bedrijf:', error)
      alert('Er is een fout opgetreden bij het bijwerken van het bedrijf.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bedrijf Bewerken</h1>
        <button
          onClick={() => router.push('/admin/bedrijven')}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Terug naar overzicht
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="naam" className="block text-sm font-medium text-gray-700 mb-2">
            Bedrijfsnaam *
          </label>
          <input
            type="text"
            id="naam"
            name="naam"
            value={formData.naam}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="beschrijving" className="block text-sm font-medium text-gray-700 mb-2">
            Beschrijving *
          </label>
          <textarea
            id="beschrijving"
            name="beschrijving"
            value={formData.beschrijving}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Korte beschrijving van uw bedrijf..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="categorie" className="block text-sm font-medium text-gray-700 mb-2">
              Categorie *
            </label>
            <select
              id="categorie"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecteer categorie</option>
              <option value="Horeca">Horeca</option>
              <option value="Winkel">Winkel</option>
              <option value="Dienstverlening">Dienstverlening</option>
              <option value="Bouw & Constructie">Bouw & Constructie</option>
              <option value="Gezondheid & Welzijn">Gezondheid & Welzijn</option>
              <option value="Auto & Transport">Auto & Transport</option>
              <option value="Sport & Recreatie">Sport & Recreatie</option>
              <option value="Onderwijs">Onderwijs</option>
              <option value="Overig">Overig</option>
            </select>
          </div>

          <div>
            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
              Label (optioneel)
            </label>
            <select
              id="label"
              name="label"
              value={formData.label || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Geen label</option>
              <option value="NIEUW">NIEUW (blauw)</option>
              <option value="PREMIUM">PREMIUM (geel)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="adres" className="block text-sm font-medium text-gray-700 mb-2">
            Adres *
          </label>
            <input
              type="text"
              id="adres"
              name="adres"
              value={formData.adres}
              onChange={handleChange}
              required
              placeholder="Straat 123, Barneveld"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="telefoon" className="block text-sm font-medium text-gray-700 mb-2">
              Telefoonnummer
            </label>
            <input
              type="tel"
              id="telefoon"
              name="telefoon"
              value={formData.telefoon}
              onChange={handleChange}
              placeholder="0342-123456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://uwbedrijf.nl"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <LogoUploadComponent
          currentLogo={formData.logo === '/barneveldsdagblad.jpeg' ? undefined : formData.logo}
          onLogoChange={handleLogoChange}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
            In de spotlight plaatsen (featured)
          </label>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Let op:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Wijzigingen worden direct doorgevoerd op de website</li>
            <li>• Controleer alle gegevens voordat u opslaat</li>
            <li>• Featured bedrijven worden prominenter getoond</li>
          </ul>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => router.push('/admin/bedrijven')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuleren
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Opslaan...' : 'Wijzigingen Opslaan'}
          </button>
        </div>
      </form>
    </div>
  )
}