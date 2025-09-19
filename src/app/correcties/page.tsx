'use client'

import { useState } from 'react'

interface Correction {
  date: string
  article: string
  articleUrl: string
  correction: string
  explanation: string
}

const corrections: Correction[] = [
  // Voorbeeld correcties - deze zouden normaal uit een database komen
  {
    date: "2024-11-15",
    article: "Gemeenteraad stemt in met nieuwe parkeerregeling",
    articleUrl: "/artikel/gemeenteraad-parkeerregeling",
    correction: "In het artikel stond dat de nieuwe tarieven per 1 januari ingaan. Dit moet zijn: per 1 februari.",
    explanation: "Door een communicatiefout werd de verkeerde datum vermeld."
  },
  {
    date: "2024-11-10",
    article: "BV De Valk wint ondernemersprijs",
    articleUrl: "/artikel/bv-de-valk-ondernemersprijs",
    correction: "De eigenaar heet Jan de Valk, niet Jan de Vries zoals vermeld.",
    explanation: "Een typefout leidde tot de verkeerde achternaam."
  }
]

export default function CorrectiesPage() {
  const [formData, setFormData] = useState({
    articleUrl: '',
    name: '',
    email: '',
    correction: '',
    evidence: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/correctie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        setFormData({
          articleUrl: '',
          name: '',
          email: '',
          correction: '',
          evidence: ''
        })
      } else {
        alert(data.message || 'Er ging iets mis. Probeer het later opnieuw.')
      }
    } catch (error) {
      console.error('Error submitting correction:', error)
      alert('Er ging iets mis. Probeer het later opnieuw.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Correcties & Rectificaties</h1>

      <div className="bg-blue-50 border-l-4 border-brand-blue p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Ons correctiebeleid</h2>
        <p>
          Bij Barnevelds Dagblad streven we naar juiste berichtgeving. Wanneer er toch een fout
          in een artikel staat, corrigeren we deze zo snel mogelijk. Alle correcties worden
          transparant op deze pagina vermeld.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recente correcties</h2>

        {corrections.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="text-green-800">
              Er zijn momenteel geen correcties. We streven ernaar om foutloos te publiceren,
              maar mocht er toch een fout zijn, dan vindt u die hier.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {corrections.map((correction, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">
                    <a href={correction.articleUrl} className="text-brand-blue hover:underline">
                      {correction.article}
                    </a>
                  </h3>
                  <span className="text-sm text-gray-500 flex-shrink-0 ml-4">
                    {new Date(correction.date).toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-3">
                  <p className="font-medium text-red-900 mb-1">Correctie:</p>
                  <p className="text-red-800">{correction.correction}</p>
                </div>

                {correction.explanation && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Toelichting:</span> {correction.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="my-12" />

      <div>
        <h2 className="text-2xl font-bold mb-6">Fout gevonden? Meld het ons</h2>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-6">
            Heeft u een fout ontdekt in een van onze artikelen? Laat het ons weten via dit formulier.
            We nemen uw melding serieus en reageren binnen 48 uur.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="articleUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Link naar artikel met fout *
              </label>
              <input
                type="url"
                id="articleUrl"
                name="articleUrl"
                required
                value={formData.articleUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="https://barneveldsdagblad.nl/artikel/..."
              />
            </div>

            <div>
              <label htmlFor="correction" className="block text-sm font-medium text-gray-700 mb-1">
                Beschrijf de fout *
              </label>
              <textarea
                id="correction"
                name="correction"
                required
                rows={4}
                value={formData.correction}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="Welke informatie klopt niet? Wat moet het zijn?"
              />
            </div>

            <div>
              <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-1">
                Onderbouwing (optioneel)
              </label>
              <textarea
                id="evidence"
                name="evidence"
                rows={3}
                value={formData.evidence}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="Heeft u bronnen of bewijs voor de correcte informatie?"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Uw naam *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-brand-blue text-white font-bold px-6 py-3 rounded-md hover:bg-brand-darkblue transition-colors"
            >
              Correctie indienen
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            * Verplichte velden. Uw gegevens worden alleen gebruikt voor het afhandelen van de correctie.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Hoe we met correcties omgaan</h3>
        <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
          <li>We beoordelen elke melding binnen 48 uur</li>
          <li>Bij een feitelijke fout passen we het artikel direct aan</li>
          <li>We vermelden de correctie duidelijk in het artikel</li>
          <li>Significante correcties worden ook op deze pagina vermeld</li>
          <li>De melder krijgt altijd een reactie per email</li>
        </ol>

        <p className="text-sm text-gray-600 mt-4">
          Voor meer informatie over ons beleid, zie ons{' '}
          <a href="/redactiestatuut" className="text-brand-blue hover:underline">redactiestatuut</a>.
        </p>
      </div>
    </div>
  )
}