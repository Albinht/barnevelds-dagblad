export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Privacybeleid</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <p className="text-xl leading-relaxed font-semibold mb-8">
          Barnevelds Dagblad respecteert uw privacy. In dit privacybeleid leggen we uit welke
          persoonsgegevens we verzamelen, waarom we dat doen, en hoe we ermee omgaan.
        </p>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <p className="font-semibold">Belangrijkste punten:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
            <li>We verzamelen minimale gegevens</li>
            <li>We verkopen NOOIT uw gegevens aan derden</li>
            <li>U heeft altijd recht op inzage, correctie en verwijdering</li>
            <li>We gebruiken cookies alleen voor noodzakelijke functies</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">1. Welke Gegevens Verzamelen We?</h2>

        <h3 className="text-xl font-semibold mt-4">1.1 Automatisch verzamelde gegevens</h3>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>IP-adres (geanonimiseerd)</li>
          <li>Browser type en versie</li>
          <li>Apparaat type (desktop, mobiel, tablet)</li>
          <li>Bezochte pagina&apos;s en klikgedrag</li>
          <li>Datum en tijd van bezoek</li>
          <li>Verwijzende website</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4">1.2 Gegevens die u zelf verstrekt</h3>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>E-mailadres (bij nieuwsbrief aanmelding)</li>
          <li>Naam (optioneel bij contact)</li>
          <li>Inhoud van berichten (bij tips of contact)</li>
        </ul>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">2. Waarom Verzamelen We Deze Gegevens?</h2>
        <div className="ml-4 space-y-2">
          <p><strong>2.1 Website verbetering:</strong> Om te begrijpen hoe bezoekers onze site gebruiken</p>
          <p><strong>2.2 Content optimalisatie:</strong> Om relevante content aan te bieden</p>
          <p><strong>2.3 Communicatie:</strong> Om te reageren op uw vragen of tips</p>
          <p><strong>2.4 Nieuwsbrief:</strong> Om u op de hoogte te houden (alleen met uw toestemming)</p>
          <p><strong>2.5 Beveiliging:</strong> Om misbruik en fraude te voorkomen</p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">3. Cookies</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="mb-3">We gebruiken alleen strikt noodzakelijke cookies:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Functionele cookies:</strong> Voor basisfunctionaliteit van de website</li>
            <li><strong>Analytics cookies:</strong> Voor geanonimiseerde statistieken (geen tracking)</li>
          </ul>
          <p className="mt-4 text-sm">
            We gebruiken GEEN marketing cookies of tracking cookies van derden.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">4. Delen van Gegevens</h2>
        <div className="bg-red-50 p-6 rounded-lg">
          <p className="font-semibold">We delen uw gegevens NOOIT met:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
            <li>Adverteerders</li>
            <li>Data brokers</li>
            <li>Marketing bureaus</li>
            <li>Social media platforms</li>
          </ul>
          <p className="mt-4">
            Uitzondering: We kunnen gegevens delen als we wettelijk verplicht zijn (bijvoorbeeld bij een gerechtelijk bevel).
          </p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">5. Beveiliging</h2>
        <p>
          We nemen de bescherming van uw gegevens serieus en hebben passende technische en
          organisatorische maatregelen genomen:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>SSL-encryptie voor alle dataoverdracht</li>
          <li>Beveiligde servers</li>
          <li>Beperkte toegang tot persoonsgegevens</li>
          <li>Regelmatige security updates</li>
        </ul>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">6. Bewaartermijnen</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>Website statistieken:</strong> 26 maanden</li>
          <li><strong>Nieuwsbrief aanmeldingen:</strong> Tot u zich uitschrijft</li>
          <li><strong>Contact berichten:</strong> Maximaal 1 jaar</li>
          <li><strong>Tips en bijdragen:</strong> Onbeperkt (voor archiefdoeleinden)</li>
        </ul>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">7. Uw Rechten</h2>
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="font-semibold mb-3">U heeft het recht op:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Inzage:</strong> Opvragen welke gegevens we van u hebben</li>
            <li><strong>Correctie:</strong> Onjuiste gegevens laten aanpassen</li>
            <li><strong>Verwijdering:</strong> Uw gegevens laten verwijderen (&quot;recht op vergetelheid&quot;)</li>
            <li><strong>Beperking:</strong> Het gebruik van uw gegevens beperken</li>
            <li><strong>Overdraagbaarheid:</strong> Uw gegevens ontvangen in een leesbaar format</li>
            <li><strong>Bezwaar:</strong> Bezwaar maken tegen verwerking</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">8. Kinderen</h2>
        <p>
          Onze website is niet gericht op kinderen onder de 16 jaar. We verzamelen niet bewust
          persoonsgegevens van kinderen. Als u vermoedt dat we gegevens van een kind hebben
          verzameld, neem dan contact met ons op.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">9. Links naar Externe Websites</h2>
        <p>
          Onze website kan links bevatten naar externe websites. Dit privacybeleid is niet van
          toepassing op deze externe sites. We raden u aan het privacybeleid van deze sites te lezen.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">10. Wijzigingen</h2>
        <p>
          We kunnen dit privacybeleid van tijd tot tijd aanpassen. Belangrijke wijzigingen zullen
          we duidelijk communiceren op onze website. De laatste wijzigingsdatum staat onderaan vermeld.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">11. Contact & Klachten</h2>
        <div className="bg-brand-blue text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-3">Vragen over privacy?</h3>
          <p>Voor vragen over dit privacybeleid of het uitoefenen van uw rechten:</p>
          <p className="mt-3">
            <strong>Functionaris Gegevensbescherming</strong><br />
            Email: <a href="mailto:privacy@barneveldsdagblad.nl" className="underline hover:text-brand-yellow">
              privacy@barneveldsdagblad.nl
            </a><br />
            We reageren binnen 48 uur op uw verzoek.
          </p>
          <p className="mt-4 text-sm">
            Niet tevreden met onze reactie? U kunt een klacht indienen bij de
            Autoriteit Persoonsgegevens via autoriteitpersoonsgegevens.nl
          </p>
        </div>

        <div className="text-sm text-gray-600 mt-8 p-4 border-t">
          <p>
            <strong>Laatst bijgewerkt:</strong> November 2024<br />
            <strong>Versie:</strong> 1.0<br />
            <strong>Vestigingsadres:</strong> Barneveld, Nederland
          </p>
        </div>
      </div>
    </div>
  )
}