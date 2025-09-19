export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Cookiebeleid</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <p className="text-xl leading-relaxed font-semibold mb-8">
          Barnevelds Dagblad gebruikt cookies om de website goed te laten functioneren.
          We gebruiken alleen strikt noodzakelijke cookies en respecteren uw privacy.
        </p>

        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <p className="font-semibold text-lg mb-2">✓ Goed nieuws voor uw privacy!</p>
          <p>
            Wij gebruiken GEEN tracking cookies, marketing cookies of cookies van advertentienetwerken.
            Alleen functionele cookies die nodig zijn voor een goede werking van de website.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Wat zijn Cookies?</h2>
        <p>
          Cookies zijn kleine tekstbestanden die op uw computer of mobiel apparaat worden opgeslagen
          wanneer u onze website bezoekt. Ze helpen de website om te onthouden wat u heeft gedaan
          tijdens uw bezoek, zoals taalvoorkeur of inloggegevens.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Welke Cookies Gebruiken Wij?</h2>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-3">1. Strikt Noodzakelijke Cookies</h3>
          <p className="mb-3">Deze cookies zijn essentieel voor het functioneren van de website.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Naam</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Doel</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bewaartermijn</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm">session_id</td>
                  <td className="px-4 py-2 text-sm">Bewaart uw sessie tijdens het bezoek</td>
                  <td className="px-4 py-2 text-sm">Tot sluiten browser</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">cookie_consent</td>
                  <td className="px-4 py-2 text-sm">Onthoudt uw cookievoorkeuren</td>
                  <td className="px-4 py-2 text-sm">1 jaar</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">security_token</td>
                  <td className="px-4 py-2 text-sm">Beschermt tegen misbruik</td>
                  <td className="px-4 py-2 text-sm">24 uur</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-3">2. Functionele Cookies</h3>
          <p className="mb-3">Deze cookies onthouden uw voorkeuren voor een betere gebruikerservaring.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Naam</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Doel</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bewaartermijn</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm">language_pref</td>
                  <td className="px-4 py-2 text-sm">Onthoudt taalvoorkeur</td>
                  <td className="px-4 py-2 text-sm">1 jaar</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">font_size</td>
                  <td className="px-4 py-2 text-sm">Onthoudt tekstgrootte voorkeur</td>
                  <td className="px-4 py-2 text-sm">1 jaar</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-3">3. Analytische Cookies (Geanonimiseerd)</h3>
          <p className="mb-3">We gebruiken alleen geanonimiseerde analytics om de website te verbeteren.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Naam</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Doel</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bewaartermijn</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm">_ga (anoniem)</td>
                  <td className="px-4 py-2 text-sm">Telt aantal bezoekers (geen tracking)</td>
                  <td className="px-4 py-2 text-sm">26 maanden</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm mt-3 text-gray-600">
            * IP-adressen worden geanonimiseerd, geen persoonlijke data wordt verzameld
          </p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Cookies die wij NIET gebruiken</h2>
        <div className="bg-red-50 p-6 rounded-lg">
          <p className="font-semibold mb-3">❌ Wij gebruiken GEEN:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Marketing of advertentie cookies</li>
            <li>Social media tracking cookies</li>
            <li>Profilerings cookies</li>
            <li>Third-party tracking cookies</li>
            <li>Retargeting cookies</li>
            <li>Cross-site tracking cookies</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Cookies Beheren</h2>
        <p>U heeft volledige controle over cookies:</p>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Cookies uitschakelen in uw browser:</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Chrome:</strong> Instellingen → Privacy en beveiliging → Cookies</li>
            <li><strong>Firefox:</strong> Instellingen → Privacy & Beveiliging → Cookies</li>
            <li><strong>Safari:</strong> Voorkeuren → Privacy → Cookies</li>
            <li><strong>Edge:</strong> Instellingen → Privacy, zoeken en services → Cookies</li>
          </ul>
          <p className="mt-4 text-sm">
            <strong>Let op:</strong> Het uitschakelen van cookies kan de functionaliteit van de website beperken.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Cookies Verwijderen</h2>
        <p>
          U kunt op elk moment cookies verwijderen via uw browserinstellingen.
          Dit heeft geen invloed op de informatie die we al hebben verzameld met uw toestemming.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Updates van dit Beleid</h2>
        <p>
          We kunnen dit cookiebeleid van tijd tot tijd bijwerken. Wijzigingen worden op deze pagina
          gepubliceerd met een nieuwe datum van &quot;laatste update&quot;. We raden u aan dit beleid
          regelmatig te controleren.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Meer Informatie</h2>
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="mb-3">Voor meer informatie over cookies kunt u terecht op:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><a href="https://www.consuwijzer.nl/telecom-post/internet/privacy/uitleg-cookies" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
              ConsuWijzer - Uitleg over cookies
            </a></li>
            <li><a href="https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/internet-telefoon-tv-en-post/cookies" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
              Autoriteit Persoonsgegevens - Cookies
            </a></li>
          </ul>
        </div>

        <div className="bg-brand-blue text-white p-6 rounded-lg mt-8">
          <h3 className="text-xl font-bold mb-3">Vragen over Cookies?</h3>
          <p>
            Heeft u vragen over ons cookiebeleid? Neem gerust contact met ons op:
          </p>
          <p className="mt-2">
            Email: <a href="mailto:privacy@barneveldsdagblad.nl?subject=Cookiebeleid"
                     className="underline hover:text-brand-yellow">
              privacy@barneveldsdagblad.nl
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