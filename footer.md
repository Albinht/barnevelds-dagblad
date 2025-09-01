# ⚡ Killer Footer Component - Barnevelds Dagblad

## 🎯 Doel van de Footer

De footer fungeert als het **eindpunt van de site** en moet vertrouwen uitstralen passend bij een professionele krantensite. Het is een **navigatie hub** die snelle toegang biedt tot service, algemene voorwaarden en contact, terwijl het tegelijkertijd de **branding** versterkt met logo, tagline en Barneveldse brandkleuren. Daarnaast dient het als **conversie-instrument** voor nieuwsbrief signups en app downloads.

## 🏗️ Footer Indeling (4-Layer Grid Structure)

### 🔹 Layer 1 – Nieuwsbrief CTA (Bovenbalk)
- **Achtergrondkleur**: Brand blauw `#0F47AF`
- **Hoofdtekst**: "Meld je aan voor de nieuwsbrief" (wit, bold)
- **Subtekst**: "Wil je elke dag het laatste nieuws ontvangen?" (wit/lichtgrijs)
- **Inputveld**: Wit, afgerond, placeholder "E-mailadres"
- **CTA Button**: Geel `#FCDD0C` met zwarte tekst "Aanmelden"
- **Social Media**: Icons rechts (wit, hover in geel)

### 🔹 Layer 2 – Slogan Section
- **Hoofdslogan**: "Wij zijn altijd op zoek naar het laatste nieuws" (grote tekst, bold zwart)
- **Call-to-action**: "Tip de redactie »" (brand blauw `#0F47AF`)
- **Layout**: Center aligned, prominent styling

### 🔹 Layer 3 – Navigatie Links (4 Kolommen)

#### **Kolom 1: Algemeen**
- Colofon
- Auteursrecht  
- Abonnementsvoorwaarden
- Gebruiksvoorwaarden
- Privacybeleid
- Toegankelijkheidsverklaring
- Cookiebeleid
- Vacatures
- Privacy-instellingen

#### **Kolom 2: Service**
- Klantenservice
- Bezorgklacht indienen
- Bezorging pauzeren of tijdelijk wijzigen
- Bezorgadres wijzigen
- Adverteren
- Losse verkoop

#### **Kolom 3: Mijn Omgeving**
- Mijn account
- Mijn abonnement(en)

#### **Kolom 4: Meer BD**
- Abonnee worden
- Digitale krant
- Nieuwsbrieven
- Webwinkel
- RSS

**Rechtsboven**: App download badges (Google Play & App Store)

### 🔹 Layer 4 – Bottom Bar (Branding)
- **Achtergrond**: Lichtgrijs `#F7F7F7`
- **Partner Logo's**: Mediapartners/Barneveldse partners
- **Copyright**: "© 2025 Barnevelds Dagblad – onderdeel van BD Nieuwsmedia"
- **Quick Links**: Cookies | Privacy | Disclaimer

## 🎨 Styling Details

### **Kleurenpalet**
- **Brand Blauw**: `#0F47AF` → Hoofdaccent, links, CTA's
- **Brand Geel**: `#FCDD0C` → Buttons, hovers, highlights  
- **Wit**: `#FFFFFF` → Tekst op donkere achtergronden
- **Zwart**: `#000000` → Headlines, primary text
- **Grijs**: `#666666` → Subtekst, secondary content

### **Typography**
- **Headlines**: Bold, uppercase (Poppins/Inter via `font-newspaper`)
- **Body tekst**: Regular, sans-serif
- **Link styling**: Underline on hover in brand blauw

### **Interactive States**
- **Links**: Hover → underline + brand blauw kleur
- **Buttons**: Hover → subtiele schaduw + donkerder geel
- **Social icons**: Wit → geel on hover

## 📱 Responsiviteit

### **Desktop (1024px+)**
- 4 kolommen navigatie
- App badges rechts naast kolommen
- Volledige newsletter CTA balk
- Horizontale partner logo's

### **Tablet (768px - 1023px)**  
- 2 kolommen navigatie
- App badges onderaan navigatie
- Newsletter form aangepast layout
- Partner logo's in grid

### **Mobile (< 768px)**
- **Accordion menu** per sectie ("Algemeen", "Service", etc.)
- Uitklapbaar voor betere UX
- Newsletter form gestacked
- Social icons horizontaal gecentreerd

## ⚙️ Dynamische Elementen

### **Newsletter Integration**
- Form connectie met mail service (Mailchimp/Klaviyo of eigen API)
- Email validatie en error handling
- Success/error states met feedback

### **Configuratie-driven Content**
- **Footer links**: Geladen uit `/src/config/footerConfig.ts`
- **App badges**: Dynamisch uit `/public/assets/`
- **Partner logo's**: JSON-array voor uitbreidbaarheid
- **Social links**: Configureerbaar via `/src/config/socialLinks.ts`

## ♿ SEO & Accessibility

### **Semantic HTML**
- Proper `<footer>` en `<nav>` elements
- Heading hierarchy (h2, h3, h4)
- `<section>` voor elke layer

### **Accessibility Features**
- **ARIA labels**: Voor alle interactive elements
- **Formulier**: `<label>` correct gekoppeld aan inputs
- **Navigation**: `<nav aria-label="Footer navigation">`
- **Skip links**: Voor screen readers

### **SEO Optimization**
- **Structured data**: Organization schema
- **Internal linking**: SEO-vriendelijke footer links
- **Alt teksten**: Voor alle afbeeldingen/logo's

## 🔄 Technische Implementatie

### **Component Architectuur**
```
src/components/Footer/
├── index.tsx              # Main footer component
├── NewsletterSignup.tsx   # Layer 1 - Newsletter CTA
├── SloganSection.tsx      # Layer 2 - Slogan + tip redactie  
├── FooterLinks.tsx        # Layer 3 - Navigation columns
├── AppBadges.tsx          # App download badges
├── SocialIcons.tsx        # Social media icons
├── PartnerLogos.tsx       # Layer 4 - Partner branding
└── types.ts               # TypeScript interfaces
```

### **Configuration Files**
```
src/config/
├── footerConfig.ts        # All footer content & links
├── socialLinks.ts         # Social media configuration
└── partnerLogos.ts        # Media partner logos
```

### **API Integration**
```
src/app/api/newsletter/
└── route.ts               # Newsletter subscription endpoint
```

## 🚀 Maintenance & Updates

### **Content Updates**
- **Links wijzigen**: Alleen `footerConfig.ts` aanpassen
- **Partners toevoegen**: `partnerLogos.ts` uitbreiden  
- **Social media**: `socialLinks.ts` configureren
- **Styling**: Tailwind classes in components

### **Reproduceerbaarheid**
- Alle content uit config bestanden
- Component-based voor herbruikbaarheid
- TypeScript voor type safety
- Git-friendly: wijzigingen traceerbaar

## ✅ Verwachte Resultaten

Een footer die:
- ✅ **Professioneel** oogt op krantniveau
- ✅ **Volledig in branding** (Barnevelds Dagblad kleuren)  
- ✅ **Dynamisch en onderhoudsvriendelijk** is
- ✅ **Conversiegericht** (nieuwsbrief & apps)
- ✅ **SEO & accessibility** compliant
- ✅ **Responsive** werkt op alle devices
- ✅ **Enterprise-ready** voor groei en wijzigingen

---

*Implementatie volgens moderne React/Next.js best practices met Tailwind CSS en TypeScript*