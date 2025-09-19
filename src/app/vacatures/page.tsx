export default function VacaturesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Vacatures</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <p className="text-xl leading-relaxed font-semibold mb-8">
          Word onderdeel van het team dat lokaal nieuws toegankelijk maakt voor heel Barneveld.
        </p>

        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-brand-blue mb-4">
              Momenteel geen openstaande vacatures
            </h2>
            <p className="text-lg mb-6">
              Op dit moment hebben we geen openstaande vacatures, maar we zijn altijd
              geïnteresseerd in getalenteerde mensen die onze missie delen.
            </p>

            <div className="bg-white p-6 rounded-lg mt-6">
              <h3 className="text-xl font-semibold mb-3">Open sollicitatie</h3>
              <p className="mb-4">
                Denk je dat je een waardevolle bijdrage kunt leveren aan Barnevelds Dagblad?
                We horen graag van je!
              </p>
              <p className="text-sm mb-4">
                Stuur je motivatie en CV naar:
              </p>
              <a
                href="mailto:redactie@barneveldsdagblad.nl?subject=Open sollicitatie"
                className="inline-block bg-brand-blue text-white font-bold px-6 py-3 rounded hover:bg-brand-darkblue transition-colors"
              >
                redactie@barneveldsdagblad.nl
              </a>
            </div>
          </div>
        </div>


        <h2 className="text-2xl font-bold text-brand-blue mt-12 mb-4">Vrijwilligers Gezocht</h2>
        <div className="bg-brand-yellow bg-opacity-20 p-6 rounded-lg">
          <p className="font-semibold mb-3">Help mee aan onze missie!</p>
          <p className="mb-4">
            Ook als vrijwilliger kun je een belangrijke bijdrage leveren. We zoeken altijd mensen voor:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Het schrijven van artikelen over lokale evenementen</li>
            <li>Fotograferen bij nieuws en evenementen</li>
            <li>Social media beheer</li>
            <li>Modereren van reacties</li>
            <li>Technische ondersteuning</li>
          </ul>
          <p className="mt-4">
            Interesse? Mail naar{' '}
            <a href="mailto:redactie@barneveldsdagblad.nl?subject=Vrijwilliger worden"
               className="text-brand-blue hover:underline font-semibold">
              redactie@barneveldsdagblad.nl
            </a>
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold mb-3">Stage lopen?</h3>
          <p>
            Ben je student journalistiek, communicatie of media? Barnevelds Dagblad biedt
            interessante stageplekken waar je echt impact kunt maken. Neem contact op voor
            de mogelijkheden.
          </p>
        </div>

        <div className="text-sm text-gray-600 mt-8 p-4 border-t">
          <p className="text-center">
            Blijf op de hoogte van toekomstige vacatures via onze{' '}
            <a href="/nieuwsbrief" className="text-brand-blue hover:underline">nieuwsbrief</a>
          </p>
        </div>
      </div>
    </div>
  )
}