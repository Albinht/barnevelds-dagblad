import { Bedrijf } from '@/types/bedrijf'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const BEDRIJVEN_FILE = path.join(process.cwd(), 'data', 'bedrijven.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Initialize bedrijven file with sample data if it doesn't exist
async function initializeBedrijvenFile() {
  await ensureDataDirectory()
  
  try {
    await fs.access(BEDRIJVEN_FILE)
  } catch {
    // File doesn't exist, create it with sample data
    const sampleBedrijven: Bedrijf[] = [
      {
        id: uuidv4(),
        naam: 'Bakkerij van Dijk',
        beschrijving: 'De lekkerste broden van Barneveld',
        categorie: 'Horeca',
        adres: 'Langstraat 45, Barneveld',
        telefoon: '0342-123456',
        website: 'https://bakkerijvandijk.nl',
        logo: '/barneveldsdagblad.jpeg',
        featured: true,
        label: 'NIEUW',
        timestamp: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        naam: 'Fietsenwinkel de Jong',
        beschrijving: 'Voor al je e-bikes en service',
        categorie: 'Winkel',
        adres: 'Hoofdstraat 12, Barneveld',
        telefoon: '0342-234567',
        website: 'https://fietsdejong.nl',
        logo: '/barneveldsdagblad.jpeg',
        featured: true,
        label: 'PREMIUM',
        timestamp: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        naam: 'Kapsalon Hair & Style',
        beschrijving: 'Moderne kapsalon in het centrum',
        categorie: 'Dienstverlening',
        adres: 'Stationsweg 89, Barneveld',
        telefoon: '0342-345678',
        website: 'https://hairstyle-barneveld.nl',
        logo: '/barneveldsdagblad.jpeg',
        featured: true,
        label: null,
        timestamp: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        naam: 'Bouwbedrijf Hendriks',
        beschrijving: 'Specialist in nieuwbouw en renovatie',
        categorie: 'Bouw & Constructie',
        adres: 'Industrieweg 25, Barneveld',
        telefoon: '0342-456789',
        website: 'https://bouwhendriks.nl',
        logo: '/barneveldsdagblad.jpeg',
        featured: true,
        label: 'PREMIUM',
        timestamp: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        naam: 'Dierenarts De Hoge Bomen',
        beschrijving: 'Zorg voor uw huisdier sinds 1985',
        categorie: 'Gezondheid & Welzijn',
        adres: 'Parkweg 67, Barneveld',
        telefoon: '0342-567890',
        website: 'https://dierenartshogeBomen.nl',
        logo: '/barneveldsdagblad.jpeg',
        featured: true,
        label: 'NIEUW',
        timestamp: new Date().toISOString(),
      }
    ]
    await fs.writeFile(BEDRIJVEN_FILE, JSON.stringify(sampleBedrijven, null, 2))
  }
}

// Get all bedrijven
export async function getBedrijven(): Promise<Bedrijf[]> {
  await initializeBedrijvenFile()
  
  try {
    const data = await fs.readFile(BEDRIJVEN_FILE, 'utf8')
    const bedrijven: Bedrijf[] = JSON.parse(data)
    
    // Sort by timestamp descending (newest first)
    return bedrijven.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  } catch (error) {
    console.error('Error reading bedrijven:', error)
    return []
  }
}

// Get featured bedrijven (voor spotlight)
export async function getFeaturedBedrijven(): Promise<Bedrijf[]> {
  const bedrijven = await getBedrijven()
  return bedrijven.filter(bedrijf => bedrijf.featured).slice(0, 5)
}

// Get bedrijf by ID
export async function getBedrijfById(id: string): Promise<Bedrijf | null> {
  const bedrijven = await getBedrijven()
  return bedrijven.find(bedrijf => bedrijf.id === id) || null
}

// Add new bedrijf
export async function addBedrijf(bedrijfData: Omit<Bedrijf, 'id' | 'timestamp'>): Promise<Bedrijf> {
  const bedrijven = await getBedrijven()
  
  const newBedrijf: Bedrijf = {
    ...bedrijfData,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
  }
  
  bedrijven.unshift(newBedrijf) // Add to beginning
  
  await fs.writeFile(BEDRIJVEN_FILE, JSON.stringify(bedrijven, null, 2))
  
  return newBedrijf
}

// Update existing bedrijf
export async function updateBedrijf(id: string, updates: Partial<Bedrijf>): Promise<Bedrijf | null> {
  const bedrijven = await getBedrijven()
  const index = bedrijven.findIndex(bedrijf => bedrijf.id === id)
  
  if (index === -1) {
    return null
  }
  
  bedrijven[index] = { ...bedrijven[index], ...updates }
  
  await fs.writeFile(BEDRIJVEN_FILE, JSON.stringify(bedrijven, null, 2))
  
  return bedrijven[index]
}

// Delete bedrijf
export async function deleteBedrijf(id: string): Promise<boolean> {
  const bedrijven = await getBedrijven()
  const filteredBedrijven = bedrijven.filter(bedrijf => bedrijf.id !== id)
  
  if (filteredBedrijven.length === bedrijven.length) {
    return false // Bedrijf not found
  }
  
  await fs.writeFile(BEDRIJVEN_FILE, JSON.stringify(filteredBedrijven, null, 2))
  
  return true
}

// Generate slug from naam
export function generateSlug(naam: string): string {
  return naam
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}