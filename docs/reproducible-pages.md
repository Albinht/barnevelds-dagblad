# 📑 Plan voor Herproduceerbare Pagina's

Een gestandaardiseerde aanpak voor het maken van consistente, SEO-geoptimaliseerde pagina's in de Barnevelds Dagblad website.

## 1. Standaard Pagina Layout

Maak één base layout component waarin de header, footer, SEO en grid styling al geregeld zijn.

**Bestand: `components/PageLayout.tsx`**

```typescript
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import { defaultSEO } from "@/config/seo";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mt-6 mb-4">{title}</h1>
        {description && <p className="text-gray-600 mb-6">{description}</p>}
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

## 2. SEO Standaardisatie

Gebruik één config (zoals eerder besproken). Alle pagina's krijgen dan automatisch goede defaults, en jij hoeft alleen nog per pagina title en description in te vullen.

**Voorbeeld: `/app/weer/page.tsx`**

```typescript
import PageLayout from "@/components/PageLayout";
import { Metadata } from "next";
import { defaultSEO } from "@/config/seo";

export const metadata: Metadata = {
  title: `Het Weer | ${defaultSEO.siteName}`,
  description: "Bekijk het actuele weer in Barneveld en omgeving.",
};

export default function WeerPage() {
  return (
    <PageLayout title="Het Weer" description="Bekijk hier de laatste weersvoorspelling.">
      <div className="bg-gray-100 p-6 rounded-lg">
        {/* Hier later API call naar weerdata */}
        <p>Vandaag wordt het 18 graden met zon</p>
      </div>
    </PageLayout>
  );
}
```

## 3. Template Kopieerbaar Maken

Elke keer als je een nieuwe pagina toevoegt:

1. **Kopieer een bestaande `page.tsx` bestand**
2. **Pas alleen de metadata, title en description aan**
3. **Vul de unieke content in**

**Voorbeeld: `/app/tv-gids/page.tsx`**

```typescript
import PageLayout from "@/components/PageLayout";
import { Metadata } from "next";
import { defaultSEO } from "@/config/seo";

export const metadata: Metadata = {
  title: `TV Gids | ${defaultSEO.siteName}`,
  description: "Bekijk het actuele TV-programma van vandaag.",
};

export default function TvGidsPage() {
  return (
    <PageLayout title="TV Gids" description="Altijd up-to-date TV-programma's.">
      <ul className="space-y-4">
        <li>20:30 – Nieuwsuur</li>
        <li>21:00 – Voetbal: Barneveld United</li>
        <li>22:00 – Film: Barneveld by Night</li>
      </ul>
    </PageLayout>
  );
}
```

## 4. Optional: AI-Ready Boilerplate

Als je met een coding agent werkt, kun je dit als instructie opnemen:

### Rule for Coding Agent:

- **Always create new pages using the PageLayout component**
- **Copy an existing `page.tsx` file and only change the metadata, title, and description**
- **Place custom content inside `<PageLayout>{children}</PageLayout>`**
- **Use `defaultSEO` for consistency across all pages**

## 5. Herproduceerbare Workflow

### Stappen voor nieuwe pagina:

1. **Nieuwe pagina maken?** → Kopieer `/app/example/page.tsx`

2. **Pas 3 velden aan:**
   - `metadata.title`
   - `metadata.description`
   - `<PageLayout title="" description="">`

3. **Klaar ✅**

---

## Template Voorbeeld

**Base Template: `/app/template/page.tsx`**

```typescript
import PageLayout from "@/components/PageLayout";
import { Metadata } from "next";
import { defaultSEO } from "@/config/seo";

export const metadata: Metadata = {
  title: `[PAGINA NAAM] | ${defaultSEO.siteName}`,
  description: "[BESCHRIJVING VAN DE PAGINA]",
};

export default function [PAGINA_NAAM]Page() {
  return (
    <PageLayout 
      title="[PAGINA TITEL]" 
      description="[KORTE BESCHRIJVING]"
    >
      {/* CUSTOM CONTENT HIER */}
      <div className="space-y-6">
        <p>Pagina content...</p>
      </div>
    </PageLayout>
  );
}
```

## Voordelen van deze Aanpak

- ✅ **Consistente styling** across alle pagina's
- ✅ **Gestandaardiseerde SEO** met defaults
- ✅ **Snelle ontwikkeling** door copy-paste workflow  
- ✅ **Makkelijk onderhoud** - wijzigingen in PageLayout worden overal toegepast
- ✅ **AI-vriendelijk** - duidelijke instructies voor automated development

## Benodigde Bestanden

1. `components/PageLayout.tsx` - Base layout component
2. `config/seo.ts` - SEO defaults configuratie  
3. Template pagina's in `/app/*/page.tsx` - Voorbeelden om te kopiëren

Deze aanpak zorgt ervoor dat elke nieuwe pagina consistent is en professioneel oogt, zonder dat je elke keer opnieuw het wiel hoeft uit te vinden.