export default function MissiePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Onze Missie</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <div className="bg-brand-blue text-white p-8 rounded-lg mb-8">
          <p className="text-xl font-semibold text-center">
            &quot;Kwalitatief lokaal nieuws toegankelijk maken voor iedereen,
            zonder drempels, zonder betaalmuur, zonder compromissen.&quot;
          </p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Waarom We Bestaan</h2>
        <p>
          In een tijd waarin lokale journalistiek onder druk staat en steeds meer nieuwsbronnen achter
          betaalmuren verdwijnen, kiezen wij bewust een andere weg. Barnevelds Dagblad gelooft dat toegang
          tot lokaal nieuws een basisrecht is, geen luxe product.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Onze Kernwaarden</h2>

        <div className="space-y-4">
          <div className="border-l-4 border-brand-yellow pl-4">
            <h3 className="text-xl font-semibold">Toegankelijkheid</h3>
            <p>Alle content is en blijft gratis toegankelijk. Geen registratie, geen abonnement, geen betaalmuur.</p>
          </div>

          <div className="border-l-4 border-brand-yellow pl-4">
            <h3 className="text-xl font-semibold">Onafhankelijkheid</h3>
            <p>Geen politieke kleur, geen commerciële beïnvloeding. Alleen eerlijke, objectieve berichtgeving.</p>
          </div>

          <div className="border-l-4 border-brand-yellow pl-4">
            <h3 className="text-xl font-semibold">Gemeenschapsgericht</h3>
            <p>Voor Barnevelders, door Barnevelders. We zijn geworteld in onze gemeenschap.</p>
          </div>

          <div className="border-l-4 border-brand-yellow pl-4">
            <h3 className="text-xl font-semibold">Transparantie</h3>
            <p>Open over onze werkwijze, bronnen en eventuele correcties. U heeft recht op de waarheid.</p>
          </div>

          <div className="border-l-4 border-brand-yellow pl-4">
            <h3 className="text-xl font-semibold">Actualiteit</h3>
            <p>24/7 het laatste nieuws, want nieuws wacht niet tot morgen.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Onze Belofte</h2>
        <p>
          We beloven u betrouwbaar, relevant en actueel nieuws uit Barneveld en omstreken.
          We beloven te luisteren naar onze lezers en open te staan voor feedback.
          We beloven fouten toe te geven en te corrigeren wanneer we die maken.
        </p>
        <p>
          Maar bovenal beloven we dat Barnevelds Dagblad altijd van en voor de gemeenschap zal blijven.
          Dit is niet zomaar een nieuwssite - dit is uw platform, uw stem, uw venster op Barneveld.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Hoe We Dit Mogelijk Maken</h2>
        <p>
          Door slim gebruik te maken van moderne technologie, vrijwillige bijdragen uit de gemeenschap,
          en partnerships met lokale organisaties kunnen we kwalitatief nieuws blijven leveren zonder
          betaalmuur. Elke bijdrage - of het nu een nieuwstip, een foto, of een donatie is -
          helpt ons deze missie waar te maken.
        </p>

        <div className="bg-gray-100 p-6 rounded-lg mt-8">
          <p className="text-center">
            <strong>Samen maken we lokaal nieuws toegankelijk voor iedereen.</strong><br />
            <span className="text-sm mt-2 block">
              Wilt u ons steunen? Neem contact op via{' '}
              <a href="mailto:redactie@barneveldsdagblad.nl" className="text-brand-blue hover:underline">
                redactie@barneveldsdagblad.nl
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}