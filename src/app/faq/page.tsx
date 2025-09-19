'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  // Algemeen
  {
    question: "Wat is Barnevelds Dagblad?",
    answer: "Barnevelds Dagblad is het onafhankelijke nieuwsplatform voor Barneveld en omstreken. We brengen 24/7 het laatste nieuws, van breaking news tot achtergrondverhalen, volledig gratis en zonder betaalmuur.",
    category: "algemeen"
  },
  {
    question: "Is al het nieuws echt gratis?",
    answer: "Ja, al onze content is volledig gratis toegankelijk. We geloven dat iedereen recht heeft op kwalitatief lokaal nieuws. Er is geen abonnement nodig en er komt geen betaalmuur.",
    category: "algemeen"
  },
  {
    question: "Hoe kunnen jullie gratis nieuws aanbieden?",
    answer: "We financieren onze operatie door advertenties, sponsored content (altijd duidelijk gemarkeerd), en vrijwillige donaties van lezers die onze missie steunen.",
    category: "algemeen"
  },
  {
    question: "Wie zit er achter Barnevelds Dagblad?",
    answer: "We zijn een team van lokale journalisten en vrijwilligers die gepassioneerd zijn over Barneveld. Voor meer informatie, bezoek onze 'Over ons' pagina.",
    category: "algemeen"
  },

  // Content
  {
    question: "Hoe vaak wordt de site bijgewerkt?",
    answer: "We updaten de site doorlopend zodra er nieuws is. Bij breaking news publiceren we direct, regulier nieuws wordt door de dag heen toegevoegd.",
    category: "content"
  },
  {
    question: "Kan ik oude artikelen terugvinden?",
    answer: "Ja, gebruik de zoekfunctie bovenaan de pagina of browse door de verschillende categorieën. Al onze artikelen blijven online beschikbaar.",
    category: "content"
  },
  {
    question: "Waarom zie ik geen reacties onder artikelen?",
    answer: "We modereren reacties om een respectvolle discussie te waarborgen. Reacties worden meestal binnen enkele uren goedgekeurd tijdens kantooruren.",
    category: "content"
  },
  {
    question: "Mag ik jullie artikelen delen?",
    answer: "Ja, u mag links naar onze artikelen delen via social media of uw eigen website. Het kopiëren van complete artikelen is niet toegestaan zonder toestemming.",
    category: "content"
  },

  // Technisch
  {
    question: "De website laadt langzaam, wat kan ik doen?",
    answer: "Probeer uw browser cache te legen (Ctrl+F5 op Windows, Cmd+Shift+R op Mac). Als het probleem aanhoudt, mail ons op redactie@barneveldsdagblad.nl",
    category: "technisch"
  },
  {
    question: "Hebben jullie een app?",
    answer: "Nog niet, maar onze website is volledig responsive en werkt uitstekend op mobiele apparaten. U kunt onze site toevoegen aan uw homescreen voor app-achtige ervaring.",
    category: "technisch"
  },
  {
    question: "Waarom werken sommige functies niet?",
    answer: "Zorg dat JavaScript is ingeschakeld en dat u een moderne browser gebruikt (Chrome, Firefox, Safari, Edge). Oudere browsers worden mogelijk niet volledig ondersteund.",
    category: "technisch"
  },
  {
    question: "Gebruiken jullie cookies?",
    answer: "We gebruiken alleen functionele cookies die nodig zijn voor de werking van de site. Geen tracking of marketing cookies. Zie ons cookiebeleid voor details.",
    category: "technisch"
  },

  // Meedoen
  {
    question: "Hoe kan ik een nieuwstip doorgeven?",
    answer: "Via onze 'Tip de redactie' pagina, per email naar redactie@barneveldsdagblad.nl, of via WhatsApp op 06-12345678. U kunt ook anoniem tippen.",
    category: "meedoen"
  },
  {
    question: "Kan ik als vrijwilliger helpen?",
    answer: "Ja graag! We zoeken altijd mensen die willen schrijven, fotograferen of op andere manieren willen bijdragen. Mail naar redactie@barneveldsdagblad.nl",
    category: "meedoen"
  },
  {
    question: "Hoe kan ik adverteren?",
    answer: "Bezoek onze 'Adverteren' pagina voor alle mogelijkheden en tarieven, of mail naar adverteren@barneveldsdagblad.nl",
    category: "meedoen"
  },
  {
    question: "Kan ik een persbericht insturen?",
    answer: "Ja, via onze 'Persbericht insturen' pagina. We beoordelen alle persberichten op nieuwswaarde voor Barneveld.",
    category: "meedoen"
  },

  // Privacy
  {
    question: "Wat doen jullie met mijn gegevens?",
    answer: "We gaan zeer zorgvuldig om met uw gegevens. We verkopen nooit gegevens aan derden en gebruiken ze alleen voor het doel waarvoor u ze heeft verstrekt. Zie ons privacybeleid voor details.",
    category: "privacy"
  },
  {
    question: "Hoe kan ik mijn gegevens laten verwijderen?",
    answer: "Stuur een email naar privacy@barneveldsdagblad.nl met uw verzoek. We handelen dit binnen 48 uur af conform de AVG.",
    category: "privacy"
  },
  {
    question: "Is mijn anonieme tip echt anoniem?",
    answer: "Ja, als u kiest voor anoniem tippen, slaan we geen identificeerbare gegevens op. We respecteren bronbescherming volledig.",
    category: "privacy"
  },
  {
    question: "Hoe kan ik me uitschrijven van de nieuwsbrief?",
    answer: "Onderaan elke nieuwsbrief vindt u een uitschrijflink. Eén klik en u bent uitgeschreven. U kunt ook mailen naar redactie@barneveldsdagblad.nl",
    category: "privacy"
  }
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('alle')
  const [openItems, setOpenItems] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'alle', name: 'Alle vragen' },
    { id: 'algemeen', name: 'Algemeen' },
    { id: 'content', name: 'Content' },
    { id: 'technisch', name: 'Technisch' },
    { id: 'meedoen', name: 'Meedoen' },
    { id: 'privacy', name: 'Privacy' }
  ]

  const toggleItem = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter(i => i !== index))
    } else {
      setOpenItems([...openItems, index])
    }
  }

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = activeCategory === 'alle' || item.category === activeCategory
    const matchesSearch = searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Veelgestelde Vragen</h1>

      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <p className="text-lg">
          Heeft u een vraag over Barnevelds Dagblad? Grote kans dat u hier het antwoord vindt.
          Staat uw vraag er niet bij? <a href="/contact" className="text-brand-blue hover:underline font-semibold">Neem contact op</a>.
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Zoek in veelgestelde vragen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-brand-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {filteredFAQ.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Geen vragen gevonden voor deze zoekopdracht.
          </p>
          <a
            href="/contact"
            className="inline-block bg-brand-blue text-white font-bold px-6 py-3 rounded-md hover:bg-brand-darkblue transition-colors"
          >
            Stel uw vraag
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFAQ.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transform transition-transform ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Vraag niet gevonden?</h2>
        <p className="text-gray-600 mb-6">
          We helpen u graag verder. Neem contact met ons op en we reageren binnen 48 uur.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-block bg-brand-blue text-white font-bold px-6 py-3 rounded-md hover:bg-brand-darkblue transition-colors"
          >
            Contact opnemen
          </a>
          <a
            href="mailto:redactie@barneveldsdagblad.nl"
            className="inline-block bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
          >
            Direct mailen
          </a>
        </div>
      </div>
    </div>
  )
}