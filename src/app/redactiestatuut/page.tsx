export default function RedactiestatuutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Redactiestatuut</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <p className="text-xl leading-relaxed font-semibold mb-8">
          Dit redactiestatuut waarborgt de journalistieke onafhankelijkheid en integriteit van
          Barnevelds Dagblad en dient als leidraad voor al onze redactionele beslissingen.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">1. Onafhankelijkheid</h2>
        <div className="ml-4 space-y-2">
          <p><strong>1.1</strong> De redactie opereert volledig onafhankelijk van commerciële, politieke of andere externe belangen.</p>
          <p><strong>1.2</strong> Adverteerders hebben geen invloed op de redactionele inhoud.</p>
          <p><strong>1.3</strong> De redactie bepaalt zelfstandig welke onderwerpen worden behandeld en hoe deze worden gebracht.</p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">2. Journalistieke Principes</h2>
        <div className="ml-4 space-y-2">
          <p><strong>2.1</strong> We streven naar waarheidsgetrouwe, nauwkeurige en volledige berichtgeving.</p>
          <p><strong>2.2</strong> We hanteren hoor en wederhoor bij controversiële onderwerpen.</p>
          <p><strong>2.3</strong> We maken een duidelijk onderscheid tussen feiten, meningen en vermoedens.</p>
          <p><strong>2.4</strong> Bronnen worden zorgvuldig gecontroleerd en waar mogelijk genoemd.</p>
          <p><strong>2.5</strong> We respecteren de privacy van betrokkenen, tenzij het publiek belang zwaarder weegt.</p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">3. Bronbescherming</h2>
        <div className="ml-4 space-y-2">
          <p><strong>3.1</strong> De identiteit van bronnen die anonimiteit verlangen wordt beschermd.</p>
          <p><strong>3.2</strong> Informatie verkregen &apos;off the record&apos; wordt niet gepubliceerd zonder expliciete toestemming.</p>
          <p><strong>3.3</strong> Vertrouwelijke documenten worden zorgvuldig behandeld.</p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">4. Transparantie en Verantwoording</h2>
        <div className="ml-4 space-y-2">
          <p><strong>4.1</strong> Fouten worden zo snel mogelijk gecorrigeerd met duidelijke vermelding.</p>
          <p><strong>4.2</strong> Bij klachten reageren we binnen 48 uur.</p>
          <p><strong>4.3</strong> Belangenverstrengeling wordt altijd vermeld.</p>
          <p><strong>4.4</strong> Gesponsorde content wordt duidelijk als zodanig gemarkeerd.</p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">5. Ethische Richtlijnen</h2>
        <div className="ml-4 space-y-2">
          <p><strong>5.1</strong> We respecteren de menselijke waardigheid en vermijden onnodige sensatie.</p>
          <p><strong>5.2</strong> We discrimineren niet op basis van afkomst, religie, geslacht, geaardheid of politieke overtuiging.</p>
          <p><strong>5.3</strong> Bij berichtgeving over minderjarigen zijn we extra zorgvuldig.</p>
          <p><strong>5.4</strong> We publiceren geen content die aanzet tot haat of geweld.</p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">6. Lokale Betrokkenheid</h2>
        <div className="ml-4 space-y-2">
          <p><strong>6.1</strong> We geven prioriteit aan nieuws dat relevant is voor Barneveld en omstreken.</p>
          <p><strong>6.2</strong> We bieden een platform voor verschillende stemmen uit de gemeenschap.</p>
          <p><strong>6.3</strong> We moedigen burgerparticipatie aan door tips en bijdragen serieus te nemen.</p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">7. Digitale Verantwoordelijkheid</h2>
        <div className="ml-4 space-y-2">
          <p><strong>7.1</strong> We verifiëren informatie voor publicatie, ook bij breaking news.</p>
          <p><strong>7.2</strong> Social media bronnen worden extra kritisch gecontroleerd.</p>
          <p><strong>7.3</strong> We waarschuwen voor nepnieuws en desinformatie.</p>
          <p><strong>7.4</strong> Comments en reacties worden gemodereerd volgens onze huisregels.</p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">8. Klachtenprocedure</h2>
        <div className="ml-4 space-y-2">
          <p><strong>8.1</strong> Klachten kunnen worden ingediend via redactie@barneveldsdagblad.nl</p>
          <p><strong>8.2</strong> Alle klachten worden serieus onderzocht en beantwoord.</p>
          <p><strong>8.3</strong> Bij structurele klachten evalueren we ons beleid.</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg mt-8">
          <p className="text-sm">
            <strong>Laatst bijgewerkt:</strong> November 2024<br />
            <strong>Vragen over dit statuut?</strong> Mail naar{' '}
            <a href="mailto:redactie@barneveldsdagblad.nl" className="text-brand-blue hover:underline">
              redactie@barneveldsdagblad.nl
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}