# n8n Integratie Handleiding - Barnevelds Dagblad

Deze handleiding legt stap voor stap uit hoe je n8n configureert om automatisch artikelen te scrapen, parafraseren en publiceren op je Barnevelds Dagblad website.

## 📋 Voorvereisten

- n8n geïnstalleerd (self-hosted of cloud)
- Toegang tot je Vercel environment variables
- Je website draait op productie

## 🔑 Stap 1: Webhook Secret Configureren

### A. Genereer een veilige API key

Open een terminal en genereer een random string:

```bash
openssl rand -hex 32
```

Of gebruik een online generator voor een veilige 32+ karakter string.

### B. Voeg de key toe aan Vercel

1. Ga naar je Vercel dashboard
2. Open je project (barnevelds-dagblad)
3. Ga naar Settings → Environment Variables
4. Voeg een nieuwe variable toe:
   - **Name:** `N8N_WEBHOOK_SECRET`
   - **Value:** De gegenereerde string uit stap A
   - **Environment:** Production (+ Preview/Development indien gewenst)
5. Klik op "Save"

### C. Redeploy je applicatie

Na het toevoegen van de environment variable moet je redeployen:
1. Ga naar de Deployments tab
2. Klik op de drie puntjes bij je laatste deployment
3. Kies "Redeploy"

## 🔧 Stap 2: n8n Workflow Setup

### A. Maak een nieuwe workflow

1. Open n8n
2. Maak een nieuwe workflow
3. Geef het een naam zoals "Barnevelds Dagblad Auto-Publisher"

### B. Voeg nodes toe voor scraping

Voor elke bron (AD.nl, Telegraaf, 112barneveld) voeg je toe:

1. **Schedule Trigger** (voor automatische runs)
   - Interval: Elke 30 minuten / elk uur
   
2. **HTTP Request** node (voor scraping)
   - Method: GET
   - URL: De RSS feed of API van de bron
   
3. **Item Lists** node (om door artikelen te loopen)

### C. Parafraseer Setup

Voeg een node toe voor parafraseren, bijvoorbeeld:

1. **OpenAI** node (als je ChatGPT gebruikt)
   - Of een andere AI service naar keuze
   - Prompt voorbeeld:
   ```
   Herschrijf het volgende nieuwsartikel voor een lokale krant in Barneveld.
   Behoud alle feitelijke informatie maar maak het uniek.
   Voeg lokale context toe waar mogelijk.
   
   Origineel artikel:
   {{$json.content}}
   ```

### D. Webhook Node Configuratie

Voeg een **HTTP Request** node toe voor het versturen naar je website:

#### Node instellingen:

**Authentication:**
- Authentication: None (we gebruiken een header)

**Request:**
- Method: `POST`
- URL: `https://barneveldsdagblad.nl/api/webhook/articles`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "X-API-Key": "{{$env.N8N_WEBHOOK_SECRET}}"
}
```

> ⚠️ **Belangrijk:** Sla je webhook secret op als n8n environment variable!
> In n8n: Settings → Environment Variables → Add Variable
> Name: `N8N_WEBHOOK_SECRET`
> Value: Dezelfde key als in Vercel

**Body (JSON):**
```json
{
  "title": "{{$json.title}}",
  "excerpt": "{{$json.excerpt.substring(0, 160)}}",
  "summary": "{{$json.summary}}",
  "content": "{{$json.paraphrased_content}}",
  "category": "{{$json.category}}",
  "tags": {{$json.tags}},
  "image": "{{$json.image_url}}",
  "source": "{{$json.source_name}}",
  "sourceUrl": "{{$json.original_url}}"
}
```

### E. Category Mapping

Map de bronnen naar de juiste categorieën:

| Bron | Category in n8n |
|------|----------------|
| AD.nl algemeen nieuws | "Nieuws" |
| AD.nl sport | "Sport" |
| Telegraaf entertainment | "Show" |
| 112barneveld | "112 Meldingen" |
| Lokaal nieuws | "Mijn Gemeente" |

Gebruik een **Switch** node om artikelen naar de juiste categorie te routeren.

## 📊 Stap 3: Data Structuur

Je webhook verwacht de volgende velden:

### Verplichte velden:
- `title` (string): Artikel titel
- `excerpt` (string, max 200 chars): Korte samenvatting
- `content` (string): Volledige artikel tekst
- `category` (string): Een van de volgende:
  - "Nieuws"
  - "Sport"
  - "Show"
  - "112 Meldingen"
  - "Mijn Gemeente"
  - "Praat Mee"
  - "Auto"
  - "Geld"
  - "Koken & Eten"
  - "Wonen"
  - "Gezond"
  - "Achter de Schermen"

### Optionele velden:
- `summary` (string): Uitgebreidere samenvatting
- `image` (string): URL naar hoofdafbeelding (leeg laten voor geen afbeelding)
- `tags` (array): Lijst met tags ["tag1", "tag2"]
- `source` (string): Bron naam (bijv. "AD.nl")
- `sourceUrl` (string): Link naar origineel artikel
- `premium` (boolean): Premium artikel? (default: false)
- `featured` (boolean): Uitgelicht artikel? (default: false)

## 🧪 Stap 4: Testen

### A. Test je webhook eerst

Open in browser of Postman:
```
GET https://barneveldsdagblad.nl/api/webhook/articles
```

Dit geeft info over de webhook zonder authenticatie.

### B. Test met API key

```bash
curl -X GET https://barneveldsdagblad.nl/api/webhook/articles \
  -H "X-API-Key: jouw-webhook-secret"
```

### C. Test artikel publicatie

```bash
curl -X POST https://barneveldsdagblad.nl/api/webhook/articles \
  -H "Content-Type: application/json" \
  -H "X-API-Key: jouw-webhook-secret" \
  -d '{
    "title": "Test Artikel van n8n",
    "excerpt": "Dit is een test excerpt",
    "content": "Dit is de volledige inhoud van het test artikel.",
    "category": "Nieuws",
    "tags": ["test", "n8n"],
    "source": "Test"
  }'
```

### D. Test in n8n

1. Voeg een **Manual Trigger** toe aan je workflow
2. Vul test data in
3. Run de workflow handmatig
4. Check de response van de webhook node

## 🚨 Troubleshooting

### Fout: "Unauthorized - Invalid API key"

**Oorzaak:** API key komt niet overeen
**Oplossing:** 
- Check of de key in Vercel exact hetzelfde is als in n8n
- Let op spaties voor/na de key
- Controleer of je na het toevoegen hebt geredeployed

### Fout: "Missing required field: [field]"

**Oorzaak:** Een verplicht veld ontbreekt
**Oplossing:** 
- Check of alle verplichte velden gevuld zijn
- Let op lege strings - die tellen als "missing"

### Fout: "Article with this title already exists"

**Oorzaak:** Er bestaat al een artikel met deze titel
**Oplossing:**
- Dit is een feature om duplicates te voorkomen
- Voeg een uniek element toe aan de titel (datum/tijd)
- Of filter in n8n om alleen nieuwe artikelen door te sturen

### Fout: "Invalid category"

**Oorzaak:** Category komt niet overeen met toegestane waardes
**Oplossing:** 
- Gebruik exact een van de categorieën uit de lijst
- Let op hoofdletters en spaties

## 📈 Best Practices

1. **Rate Limiting:** Stuur max 10-20 artikelen per uur om server niet te overbelasten

2. **Duplicate Check:** Voeg in n8n een check toe of artikel al bestaat:
   - Bewaar gepubliceerde artikel IDs in n8n database
   - Of check eerst via GET request of titel al bestaat

3. **Error Handling:** Voeg een **Error Trigger** node toe:
   - Log fouten naar een file/database
   - Stuur notificatie bij failures

4. **Scheduling:** 
   - Draai scraper elke 30-60 minuten
   - Niet vaker dan nodig om API limits te respecteren

5. **Content Quality:**
   - Test je parafrasering goed
   - Voeg altijd bronvermelding toe
   - Check of lokale context klopt

## 🔒 Security Notes

- **NOOIT** je webhook secret delen of in code committen
- Roteer je API key regelmatig (maandelijks)
- Monitor je webhook logs voor ongeautoriseerde pogingen
- Overweeg IP whitelisting als je n8n een vast IP heeft

## 📝 Voorbeeld n8n Workflow JSON

Je kunt deze workflow importeren in n8n als startpunt:

```json
{
  "name": "Barnevelds Dagblad Publisher",
  "nodes": [
    {
      "name": "Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300],
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "hours",
              "hoursInterval": 1
            }
          ]
        }
      }
    },
    {
      "name": "Scrape Source",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300],
      "parameters": {
        "url": "https://source-rss-feed.xml",
        "responseFormat": "json"
      }
    },
    {
      "name": "Paraphrase",
      "type": "n8n-nodes-base.openAi",
      "position": [650, 300],
      "parameters": {
        "operation": "text",
        "prompt": "Paraphrase this article..."
      }
    },
    {
      "name": "Publish to Website",
      "type": "n8n-nodes-base.httpRequest",
      "position": [850, 300],
      "parameters": {
        "method": "POST",
        "url": "https://barneveldsdagblad.nl/api/webhook/articles",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "X-API-Key",
              "value": "={{$env.N8N_WEBHOOK_SECRET}}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "title",
              "value": "={{$json.title}}"
            }
          ]
        }
      }
    }
  ]
}
```

## 💡 Extra Tips

1. **Test Endpoint:** Er is ook een test endpoint beschikbaar:
   ```
   GET https://barneveldsdagblad.nl/api/webhook/test
   ```
   Deze valideert je setup zonder artikelen aan te maken.

2. **Monitoring:** Check regelmatig:
   - Vercel Functions logs voor webhook calls
   - n8n execution logs
   - Database voor gepubliceerde artikelen

3. **Backup:** Bewaar altijd originele artikelen in n8n voor referentie

## 🆘 Hulp Nodig?

Als je problemen hebt:
1. Check Vercel Functions logs
2. Check n8n execution details
3. Test met curl commando's
4. Valideer JSON structuur

Succes met het automatiseren van je nieuwssite! 🚀