'use client'

import { useState } from 'react'

export default function PersberichtPage() {
  const [formData, setFormData] = useState({
    organization: '',
    contactName: '',
    email: '',
    phone: '',
    title: '',
    subtitle: '',
    content: '',
    embargo: false,
    embargoDate: '',
    hasAttachments: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/persbericht', {
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
          organization: '',
          contactName: '',
          email: '',
          phone: '',
          title: '',
          subtitle: '',
          content: '',
          embargo: false,
          embargoDate: '',
          hasAttachments: false
        })
      } else {
        alert(data.message || 'Er ging iets mis. Probeer het later opnieuw.')
      }
    } catch (error) {
      console.error('Error submitting press release:', error)
      alert('Er ging iets mis. Probeer het later opnieuw.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Persbericht Insturen</h1>

      <div className="bg-blue-50 border-l-4 border-brand-blue p-6 mb-8">
        <p className="text-lg font-semibold mb-2">Voor organisaties en bedrijven</p>
        <p>
          Heeft uw organisatie nieuws te melden? Stuur ons uw persbericht en wij beoordelen
          of het geschikt is voor publicatie.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Persbericht Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Contactgegevens</h3>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                    Organisatie/Bedrijf *
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    required
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                      Contactpersoon *
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefoonnummer *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
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

              <hr />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Persbericht Inhoud</h3>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Titel persbericht *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="Pakkende titel van maximaal 80 karakters"
                  />
                </div>

                <div>
                  <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Ondertitel (optioneel)
                  </label>
                  <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="Korte samenvatting of context"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Volledige tekst persbericht *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    required
                    rows={12}
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="Begin met de belangrijkste informatie. Beantwoord de 5 W's: Wie, Wat, Waar, Wanneer, Waarom..."
                  />
                </div>
              </div>

              <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="embargo"
                    checked={formData.embargo}
                    onChange={handleChange}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="font-medium">Dit persbericht heeft een embargo</span>
                </label>

                {formData.embargo && (
                  <div>
                    <label htmlFor="embargoDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Embargo tot datum/tijd
                    </label>
                    <input
                      type="datetime-local"
                      id="embargoDate"
                      name="embargoDate"
                      value={formData.embargoDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasAttachments"
                    checked={formData.hasAttachments}
                    onChange={handleChange}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="font-medium">Ik heb bijlagen (foto&apos;s, documenten)</span>
                </label>
                {formData.hasAttachments && (
                  <p className="text-sm text-gray-600 mt-2 ml-7">
                    Na het versturen ontvangt u instructies voor het toesturen van bijlagen.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="bg-brand-blue text-white font-bold px-6 py-3 rounded-md hover:bg-brand-darkblue transition-colors"
              >
                Verstuur persbericht
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
              * Verplichte velden. Persberichten worden beoordeeld door onze redactie.
            </p>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Richtlijnen Persbericht</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-brand-yellow mr-2">•</span>
                <span>Maximaal 400 woorden</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-yellow mr-2">•</span>
                <span>Nieuws moet relevant zijn voor Barneveld</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-yellow mr-2">•</span>
                <span>Feitelijk en objectief geschreven</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-yellow mr-2">•</span>
                <span>Voorzien van contactgegevens</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-yellow mr-2">•</span>
                <span>Liefst met beeldmateriaal</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Voorbeeldstructuur</h3>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Pakkende kop</li>
              <li>Lead: belangrijkste info (5 W&apos;s)</li>
              <li>Kern van het verhaal</li>
              <li>Quotes van betrokkenen</li>
              <li>Achtergrondinformatie</li>
              <li>Praktische informatie</li>
              <li>Noot voor redactie</li>
            </ol>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Vragen?</h3>
            <p className="text-sm mb-3">
              Heeft u vragen over het insturen van een persbericht?
            </p>
            <p className="text-sm">
              Mail naar:{' '}
              <a href="mailto:redactie@barneveldsdagblad.nl" className="text-brand-blue hover:underline">
                redactie@barneveldsdagblad.nl
              </a>
            </p>
            <p className="text-sm mt-2">
              Of bel tijdens kantooruren:<br />
              <span className="font-semibold">06-12345678</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}