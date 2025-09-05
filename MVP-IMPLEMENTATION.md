# 🚀 Barnevelds Dagblad - MVP Implementation Plan

## 📌 Project Overzicht
**Doel**: Een volledig werkende MVP van Barnevelds Dagblad die schaalbaar is naar andere dorpen voor het bouwen van linkable assets met geautomatiseerde unieke content.

**Status**: Pre-MVP  
**Target Launch**: 6 weken vanaf start  
**Prioriteit**: Werkende features > Perfectie

---

## 🎯 MVP Requirements

### Must Have (Week 1-2)
- ✅ Werkende artikel publicatie via N8N
- ⚠️ Afbeeldingen upload & display
- ⚠️ 112 Meldingen mobile responsive
- ⚠️ Bedrijven toevoegen bug fix
- ⚠️ Basis navigatie werkend
- ⚠️ Categorie fallback images

### Should Have (Week 3-4)
- ⚠️ Reacties/comments systeem
- ⚠️ Contact pagina
- ⚠️ Nieuwsbrief logging
- ⚠️ Weer widget
- ⚠️ TV gids basis

### Nice to Have (Week 5-6)
- ⚠️ Verjaardagen pagina
- ⚠️ Vacatures sectie
- ⚠️ Forum/Praat Mee
- ⚠️ GSC indexering
- ⚠️ Social sharing

---

## 📋 FASE 1: KRITIEKE FIXES (Week 1)

### 1.1 Afbeeldingen Systeem 🖼️
**Probleem**: Upload functionaliteit werkt niet consistent  
**Oplossing**:
```typescript
// Fix upload endpoint
// Add Cloudinary/Vercel Blob integration
// Implement fallback system
```
**Files**:
- `/src/app/api/admin/upload/route.ts`
- `/src/lib/uploadHandler.ts`
- `/src/components/ImageUpload.tsx`

### 1.2 Categorie Fallback Icons 🎨
**Implementatie**: Standaard afbeeldingen per categorie
```typescript
const categoryIcons = {
  'Lokaal Nieuws': '/images/categories/lokaal-nieuws.svg',
  '112 Meldingen': '/images/categories/112.svg',
  'Sport': '/images/categories/sport.svg',
  // etc...
}
```
**Files**:
- `/src/lib/categoryIcons.ts`
- `/public/images/categories/`

### 1.3 112 Meldingen Mobile Fix 📱
**Probleem**: Widget niet responsive op mobile  
**Oplossing**:
- Responsive CSS classes toevoegen
- Touch gestures implementeren
- Mobile-first design

**Files**:
- `/src/components/widgets/Emergency112Widget.tsx`
- `/src/styles/emergency.css`

### 1.4 Create Bedrijf Bug 🐛
**Probleem**: Database error bij toevoegen bedrijf  
**Debugging**:
```bash
# Check Prisma schema
# Validate required fields
# Add proper error handling
```

---

## 📋 FASE 2: CORE FEATURES (Week 2-3)

### 2.1 Comments Systeem 💬
**Database Schema** (already exists):
```prisma
model Comment {
  id        String    @id @default(cuid())
  content   String
  approved  Boolean   @default(false)
  articleId String
  authorId  String
  // ...
}
```

**Implementation**:
- Comment form component
- Moderation dashboard
- Anti-spam (honeypot + rate limiting)
- Email notifications

**Files**:
- `/src/components/CommentSection.tsx`
- `/src/app/api/comments/route.ts`
- `/src/app/admin/comments/page.tsx`

### 2.2 Contact Pagina 📞
**Features**:
- Contact formulier
- Google Maps integratie
- Openingstijden
- Social media links

**Files**:
- `/src/app/contact/page.tsx`
- `/src/components/ContactForm.tsx`
- `/src/app/api/contact/route.ts`

### 2.3 Nieuwsbrief Logging 📧
**Requirements**:
- Store in database
- Export functionaliteit
- Double opt-in
- Unsubscribe link

**Database**:
```prisma
model Newsletter {
  id        String   @id @default(cuid())
  email     String   @unique
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

---

## 📋 FASE 3: COMMUNITY FEATURES (Week 3-4)

### 3.1 Verjaardagen Pagina 🎂
**MVP Versie**:
- Simpele lijst van verjaardagen vandaag
- Privacy: alleen voornaam + leeftijd (optioneel)
- Aanmeld formulier

**Files**:
- `/src/app/verjaardagen/page.tsx`
- `/src/components/BirthdayWidget.tsx`

### 3.2 Vacatures/Vrijwilligers 👥
**Features**:
- CRUD voor vacatures
- Categorie filter
- Contact per vacature
- Featured op homepage

**Files**:
- `/src/app/vacatures/page.tsx`
- `/src/app/admin/vacatures/page.tsx`

### 3.3 Forum/Praat Mee 🗣️
**MVP Forum**:
- Topics aanmaken
- Reacties plaatsen
- Basis moderatie
- Categorieën

**Files**:
- `/src/app/forum/page.tsx`
- `/src/app/forum/[topic]/page.tsx`

---

## 📋 FASE 4: CONTENT & UI (Week 4-5)

### 4.1 Weer Widget ☀️
**API**: OpenWeatherMap
```typescript
const WEATHER_API = process.env.OPENWEATHER_API_KEY
const BARNEVELD_COORDS = { lat: 52.1401, lon: 5.5816 }
```

**Files**:
- `/src/components/WeatherWidget.tsx`
- `/src/app/api/weather/route.ts`

### 4.2 TV Gids 📺
**Data Source**: TVGids.nl API of scraping
**Features**:
- Vandaag + morgen
- Populaire zenders
- Prime time highlight

**Files**:
- `/src/app/tv-gids/page.tsx`
- `/src/components/TVGuide.tsx`

### 4.3 UI Cleanup 🧹
**Te verwijderen**:
- Losse verkoop references
- Digitale krant links
- Placeholder content
- Broken links

### 4.4 Logo & Branding 🎨
**Tasks**:
- Upload correct logo
- Update favicon
- Social media preview images
- Email templates

---

## 📋 FASE 5: VERIFICATIE (Week 5)

### 5.1 Link Audit 🔗
```bash
# Check all links
npm run check-links

# Find dead routes
grep -r "href=" src/ | grep -v "http"
```

### 5.2 SEO Setup 🔍
**Checklist**:
- [ ] Sitemap.xml genereren
- [ ] Robots.txt optimaliseren
- [ ] Meta tags per pagina
- [ ] Schema.org markup
- [ ] Google Search Console
- [ ] Analytics setup

### 5.3 Pagina's Afmaken 📄
**Required Pages**:
- `/over-ons`
- `/privacy`
- `/algemene-voorwaarden`
- `/cookies`
- `/adverteren`

---

## 📋 FASE 6: AUTOMATISERING (Week 6)

### 6.1 N8N Workflows 🤖
**Workflows te bouwen**:
1. **RSS Aggregator**
   - Bronnen: lokale nieuwssites
   - Filtering op Barneveld keywords
   - Auto-categorisatie

2. **AI Content Generator**
   - OpenAI/Claude API
   - Herschrijven voor uniekheid
   - SEO optimalisatie
   - Auto-tagging

3. **Image Processing**
   - Auto-resize
   - Watermark toevoegen
   - Alt text generatie

4. **Social Media Poster**
   - Facebook API
   - Twitter/X API
   - LinkedIn API
   - Instagram (via Buffer)

### 6.2 Monitoring 📊
**Setup**:
- Uptime monitoring (UptimeRobot)
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance (Lighthouse CI)

---

## 🚀 Deployment Checklist

### Pre-Launch
- [ ] Database backup
- [ ] Environment variables check
- [ ] SSL certificaat
- [ ] CDN setup
- [ ] Email configuratie
- [ ] Payment gateway (future)

### Launch Day
- [ ] DNS switch
- [ ] Monitor errors
- [ ] Test critical paths
- [ ] Announce on social media
- [ ] Email subscribers

### Post-Launch
- [ ] Monitor analytics
- [ ] Gather feedback
- [ ] Fix urgent bugs
- [ ] Plan v2 features

---

## 📈 Success Metrics

### Week 1 Goals
- 100% critical paths working
- 0 console errors
- Mobile responsive

### Month 1 Goals
- 100+ articles published
- 50+ newsletter signups
- 10+ bedrijven listed
- 5+ daily active users

### Month 3 Goals
- 1000+ articles
- 500+ newsletter subscribers
- 50+ bedrijven
- 100+ daily active users
- Ready to duplicate to tweede dorp

---

## 🔧 Tech Stack

### Current
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Prisma ORM)
- **Hosting**: Vercel
- **Storage**: Vercel Blob

### To Add
- **Email**: SendGrid/Resend
- **Search**: Algolia/MeiliSearch
- **CDN**: Cloudflare
- **Monitoring**: Sentry
- **Analytics**: Google Analytics 4

---

## 👥 Team & Resources

### Required Skills
- [ ] Next.js developer
- [ ] UI/UX designer
- [ ] Content writer
- [ ] N8N specialist
- [ ] SEO specialist

### Time Estimates
- **Development**: 120 hours
- **Content**: 40 hours
- **Testing**: 20 hours
- **Deployment**: 10 hours
- **Total**: ~190 hours (5 weeks @ 40h/week)

---

## 📝 Notes & Decisions

### Design Decisions
- Mobile-first approach
- Minimalist design
- Fast loading priority
- Accessibility WCAG 2.1 AA

### Content Strategy
- 70% automated content
- 20% curated content
- 10% original content
- Daily publishing minimum

### Monetization (Future)
- Local business directory (paid)
- Sponsored content
- Banner advertising
- Premium features

---

## 🚨 Risk Management

### Technical Risks
- **Database overload**: Implement caching
- **Image storage costs**: Optimize & compress
- **API rate limits**: Implement queuing

### Content Risks
- **Duplicate content**: AI uniqueness check
- **Copyright issues**: Proper attribution
- **Fake news**: Source verification

### Business Risks
- **Low adoption**: Marketing campaign
- **Competition**: Unique features
- **Costs**: Keep MVP lean

---

## 📅 Weekly Milestones

### Week 1 ✅
- [ ] All critical bugs fixed
- [ ] Image system working
- [ ] Mobile responsive

### Week 2
- [ ] Comments live
- [ ] Contact page done
- [ ] Newsletter working

### Week 3
- [ ] Community features MVP
- [ ] Weather widget
- [ ] TV guide

### Week 4
- [ ] All pages complete
- [ ] SEO optimized
- [ ] Links verified

### Week 5
- [ ] N8N workflows
- [ ] Testing complete
- [ ] Performance optimized

### Week 6
- [ ] Launch ready
- [ ] Monitoring setup
- [ ] Documentation complete

---

## 🎯 Definition of Done

### For Each Feature
- [ ] Code complete
- [ ] Tested on mobile
- [ ] No console errors
- [ ] Documented
- [ ] Deployed to staging

### For MVP
- [ ] All must-haves complete
- [ ] 80% should-haves complete
- [ ] Performance score >80
- [ ] SEO score >90
- [ ] Zero critical bugs

---

## 🔄 Next Steps After MVP

### Phase 2 Features
- Advanced forum
- Event calendar
- Business reviews
- Classified ads
- Mobile app

### Expansion Strategy
1. Perfect Barneveld site
2. Document processes
3. Create template
4. Deploy to Nijkerk
5. Scale to 10 dorpen
6. Automate deployment

---

## 📞 Support & Contact

**Development Issues**: Create GitHub issue  
**Content Questions**: contact@barneveldsdagblad.nl  
**Urgent Bugs**: WhatsApp dev team  

---

*Last Updated: 2025-09-05*  
*Version: 1.0.0*  
*Status: In Development*