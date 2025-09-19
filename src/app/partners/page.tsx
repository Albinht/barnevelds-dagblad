export default function PartnersPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Partners</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <p className="text-xl leading-relaxed font-semibold mb-8">
          Barnevelds Dagblad is een volledig onafhankelijk nieuwsplatform dat samenwerkt met
          verschillende lokale organisaties om u het beste nieuws uit Barneveld te brengen.
        </p>

        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-brand-blue mb-4">Word Partner</h2>
          <p className="mb-6">
            Op dit moment zijn we actief op zoek naar partners die onze missie delen:
            het toegankelijk maken van kwalitatief lokaal nieuws voor iedereen.
          </p>

          <div className="space-y-4 text-left max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold">We zoeken partners voor:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Lokale evenementen en activiteiten</li>
              <li>Sportverenigingen en culturele organisaties</li>
              <li>Onderwijsinstellingen</li>
              <li>Maatschappelijke organisaties</li>
              <li>Lokale ondernemers die onze missie steunen</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Wat Bieden Wij?</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <span className="text-brand-yellow text-2xl mr-3">✓</span>
            <p>Een platform met dagelijks duizenden bezoekers uit Barneveld en omstreken</p>
          </div>
          <div className="flex items-start">
            <span className="text-brand-yellow text-2xl mr-3">✓</span>
            <p>Professionele berichtgeving over uw evenementen en activiteiten</p>
          </div>
          <div className="flex items-start">
            <span className="text-brand-yellow text-2xl mr-3">✓</span>
            <p>Verbinding met de lokale gemeenschap</p>
          </div>
          <div className="flex items-start">
            <span className="text-brand-yellow text-2xl mr-3">✓</span>
            <p>Transparante samenwerking zonder verborgen agenda&apos;s</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Onze Voorwaarden</h2>
        <p>
          We werken alleen samen met partners die:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Onze journalistieke onafhankelijkheid respecteren</li>
          <li>Een positieve bijdrage leveren aan de Barneveldse gemeenschap</li>
          <li>Transparant zijn in hun communicatie</li>
          <li>Onze missie van gratis toegankelijk nieuws ondersteunen</li>
        </ul>

        <div className="bg-brand-blue text-white p-6 rounded-lg mt-8">
          <h3 className="text-xl font-bold mb-3">Interesse in een Partnerschap?</h3>
          <p>
            Neem contact met ons op om de mogelijkheden te bespreken.
            We staan open voor creatieve samenwerkingen die waarde toevoegen voor onze lezers.
          </p>
          <p className="mt-4">
            <a
              href="mailto:redactie@barneveldsdagblad.nl?subject=Partnerschap Barnevelds Dagblad"
              className="inline-block bg-brand-yellow text-black font-bold px-6 py-3 rounded hover:bg-yellow-400 transition-colors mt-2"
            >
              Contact Opnemen
            </a>
          </p>
        </div>

        <div className="text-sm text-gray-600 mt-8 p-4 border-t">
          <p>
            <strong>Let op:</strong> Partnerships betekenen niet dat partners invloed hebben op onze
            redactionele inhoud. We behouden te allen tijde onze journalistieke onafhankelijkheid.
          </p>
        </div>
      </div>
    </div>
  )
}