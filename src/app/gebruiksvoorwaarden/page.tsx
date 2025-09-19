export default function GebruiksvoorwaardenPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Gebruiksvoorwaarden</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <p className="text-xl leading-relaxed font-semibold mb-8">
          Door gebruik te maken van Barnevelds Dagblad gaat u akkoord met deze gebruiksvoorwaarden.
          Lees deze voorwaarden zorgvuldig door.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">1. Acceptatie Voorwaarden</h2>
        <p>
          Door toegang tot en gebruik van www.barneveldsdagblad.nl accepteert u deze gebruiksvoorwaarden.
          Als u niet akkoord gaat met deze voorwaarden, verzoeken wij u de website niet te gebruiken.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">2. Gebruik van de Website</h2>
        <div className="ml-4 space-y-2">
          <p><strong>2.1</strong> De website is uitsluitend bedoeld voor persoonlijk, niet-commercieel gebruik.</p>
          <p><strong>2.2</strong> U mag geen geautomatiseerde systemen gebruiken om toegang tot de website te krijgen.</p>
          <p><strong>2.3</strong> Het is verboden de website te gebruiken op een manier die schade kan toebrengen aan de website of de beschikbaarheid ervan kan belemmeren.</p>
          <p><strong>2.4</strong> U mag de website niet gebruiken voor illegale doeleinden of activiteiten.</p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">3. Intellectueel Eigendom</h2>
        <p>
          Alle content op Barnevelds Dagblad is auteursrechtelijk beschermd. Het is NIET toegestaan om
          zonder voorafgaande schriftelijke toestemming content te kopiëren, reproduceren, distribueren
          of op andere wijze te gebruiken. Zie onze <a href="/auteursrecht" className="text-brand-blue hover:underline">auteursrecht pagina</a> voor meer informatie.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">4. User Generated Content</h2>
        <div className="ml-4 space-y-2">
          <p><strong>4.1</strong> Bij het plaatsen van reacties of het insturen van content blijft u verantwoordelijk voor uw bijdrage.</p>
          <p><strong>4.2</strong> U garandeert dat uw bijdrage geen inbreuk maakt op rechten van derden.</p>
          <p><strong>4.3</strong> U verleent Barnevelds Dagblad een royalty-vrije licentie om ingezonden content te gebruiken.</p>
          <p><strong>4.4</strong> Wij behouden het recht reacties te verwijderen die in strijd zijn met deze voorwaarden.</p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">5. Gedragsregels</h2>
        <div className="bg-yellow-50 p-6 rounded-lg">
          <p className="font-semibold mb-3">Het is NIET toegestaan om:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Discriminerende, beledigende of haatdragende content te plaatsen</li>
            <li>Persoonlijke gegevens van anderen zonder toestemming te delen</li>
            <li>Spam of commerciële boodschappen te plaatsen</li>
            <li>Valse informatie of misleidende content te verspreiden</li>
            <li>Te hacken of de beveiliging van de website te omzeilen</li>
            <li>Virussen of schadelijke code te verspreiden</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">6. Privacy</h2>
        <p>
          Uw gebruik van onze website is onderworpen aan ons privacybeleid.
          Door gebruik te maken van de website, stemt u in met onze praktijken rond gegevensverzameling
          en -gebruik zoals beschreven in ons <a href="/privacy" className="text-brand-blue hover:underline">privacybeleid</a>.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">7. Aansprakelijkheid</h2>
        <div className="ml-4 space-y-2">
          <p><strong>7.1</strong> Barnevelds Dagblad streeft naar juiste en actuele informatie, maar kan geen garanties geven over de volledigheid of juistheid.</p>
          <p><strong>7.2</strong> Wij zijn niet aansprakelijk voor schade voortvloeiend uit het gebruik van de website.</p>
          <p><strong>7.3</strong> Wij zijn niet verantwoordelijk voor content op externe websites waarnaar wordt gelinkt.</p>
          <p><strong>7.4</strong> U vrijwaart Barnevelds Dagblad van alle claims voortvloeiend uit uw gebruik van de website.</p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">8. Links naar Externe Websites</h2>
        <p>
          Onze website kan links bevatten naar externe websites. Wij hebben geen controle over deze
          websites en zijn niet verantwoordelijk voor hun inhoud of privacybeleid. Het gebruik van
          externe websites is op eigen risico.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">9. Wijzigingen</h2>
        <p>
          Barnevelds Dagblad behoudt zich het recht voor deze gebruiksvoorwaarden op elk moment te wijzigen.
          Wijzigingen zijn van kracht zodra ze op de website zijn gepubliceerd. Het is uw verantwoordelijkheid
          om regelmatig deze voorwaarden te controleren.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">10. Beëindiging</h2>
        <p>
          Wij behouden het recht om op elk moment, zonder voorafgaande kennisgeving, uw toegang tot
          de website te beëindigen als u deze voorwaarden schendt.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">11. Toepasselijk Recht</h2>
        <p>
          Op deze gebruiksvoorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd
          aan de bevoegde rechter in het arrondissement Gelderland.
        </p>

        <div className="bg-brand-blue text-white p-6 rounded-lg mt-8">
          <h3 className="text-xl font-bold mb-3">Contact</h3>
          <p>
            Voor vragen over deze gebruiksvoorwaarden kunt u contact opnemen via:
          </p>
          <p className="mt-2">
            Email: <a href="mailto:redactie@barneveldsdagblad.nl?subject=Gebruiksvoorwaarden"
                     className="underline hover:text-brand-yellow">
              redactie@barneveldsdagblad.nl
            </a>
          </p>
        </div>

        <div className="text-sm text-gray-600 mt-8 p-4 border-t">
          <p>
            <strong>Laatst bijgewerkt:</strong> November 2024<br />
            <strong>Versie:</strong> 1.0
          </p>
        </div>
      </div>
    </div>
  )
}