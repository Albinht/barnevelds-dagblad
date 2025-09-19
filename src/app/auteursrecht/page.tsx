export default function AuteursrechtPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Auteursrecht</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <p className="text-xl leading-relaxed font-semibold mb-8">
          Alle content op Barnevelds Dagblad is auteursrechtelijk beschermd.
          Hieronder vindt u de voorwaarden voor het gebruik van onze content.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Eigendomsrechten</h2>
        <p>
          Alle rechten op de inhoud van Barnevelds Dagblad (teksten, foto&apos;s, video&apos;s, graphics, logo&apos;s en overige content)
          berusten bij Barnevelds Dagblad of haar licentiegevers, tenzij anders vermeld.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Gebruik van Onze Content</h2>
        <div className="bg-red-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Strikt Auteursrechtbeleid</h3>
          <p className="font-semibold mb-3">
            Alle content op Barnevelds Dagblad is strikt beschermd door auteursrecht.
            Geen enkele vorm van overname, kopiëren of hergebruik is toegestaan zonder
            voorafgaande schriftelijke toestemming.
          </p>
          <p>Dit betekent dat het NIET is toegestaan om:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
            <li>Artikelen geheel of gedeeltelijk over te nemen</li>
            <li>Foto&apos;s, video&apos;s of graphics te downloaden of te hergebruiken</li>
            <li>Content te kopiëren, ook niet met bronvermelding</li>
            <li>Systematisch content te verzamelen (scrapen)</li>
            <li>Content te gebruiken voor commerciële of niet-commerciële doeleinden</li>
            <li>Content aan te passen, te bewerken of te vertalen</li>
            <li>Een afgeleide website of dienst te maken op basis van onze content</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Wat is Wel Toegestaan?</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p>Uitsluitend het volgende is toegestaan:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
            <li>Lezen en bekijken van content op onze website</li>
            <li>Delen van links naar onze artikelen via social media</li>
            <li>Linken naar onze artikelen vanaf uw eigen website (zonder content over te nemen)</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Uitzonderingen</h2>
        <p>
          In zeer uitzonderlijke gevallen kunnen we schriftelijke toestemming verlenen voor gebruik.
          Dit wordt per geval beoordeeld en alleen toegestaan als het past binnen onze missie en waarden.
          Toestemming moet ALTIJD vooraf schriftelijk worden aangevraagd en verkregen.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Content van Derden</h2>
        <p>
          Soms publiceren we content van derden (persbureaus, fotografen, gasschrijvers).
          Deze content kan onder andere licentievoorwaarden vallen. Dit wordt altijd vermeld
          bij het betreffende artikel.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">User Generated Content</h2>
        <p>
          Door het insturen van tips, foto&apos;s of andere content aan Barnevelds Dagblad, geeft u ons
          toestemming deze te publiceren en te gebruiken op al onze platformen. U blijft eigenaar
          van uw content, maar verleent ons een royalty-vrije licentie voor gebruik.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Inbreuk Melden</h2>
        <p>
          Denkt u dat wij inbreuk maken op uw auteursrecht? Of heeft u een inbreuk op ons
          auteursrecht geconstateerd? Neem dan direct contact met ons op.
        </p>

        <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">Creative Commons</h2>
        <p>
          Sommige content wordt gepubliceerd onder een Creative Commons licentie.
          Dit wordt duidelijk vermeld bij het betreffende artikel. In dat geval gelden
          de voorwaarden van de specifieke CC-licentie.
        </p>

        <div className="bg-brand-blue text-white p-6 rounded-lg mt-8">
          <h3 className="text-xl font-bold mb-3">Contact voor Auteursrechtzaken</h3>
          <p>
            Voor vragen over auteursrecht of aanvragen voor gebruik:
          </p>
          <p className="mt-2">
            Email: <a href="mailto:redactie@barneveldsdagblad.nl?subject=Auteursrecht"
                     className="underline hover:text-brand-yellow">
              redactie@barneveldsdagblad.nl
            </a><br />
            Vermeld: &quot;Auteursrecht&quot; in de onderwerpregel
          </p>
        </div>

        <div className="text-sm text-gray-600 mt-8 p-4 border-t">
          <p>
            <strong>© 2024 Barnevelds Dagblad</strong><br />
            Alle rechten voorbehouden. Niets uit deze uitgave mag worden verveelvoudigd,
            opgeslagen in een geautomatiseerd gegevensbestand, of openbaar gemaakt, in enige
            vorm of op enige wijze, zonder voorafgaande schriftelijke toestemming.
          </p>
        </div>
      </div>
    </div>
  )
}