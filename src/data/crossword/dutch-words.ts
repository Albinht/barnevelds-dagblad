// Nederlandse woordenlijst voor kruiswoordpuzzels
// Georganiseerd per lengte en moeilijkheidsgraad

export interface Word {
  word: string
  clue: string
  difficulty: 'easy' | 'medium' | 'hard'
  category?: string
}

// 3-letter woorden
export const threeLetterWords: Word[] = [
  // Easy
  { word: 'AAP', clue: 'Primaat', difficulty: 'easy' },
  { word: 'ARM', clue: 'Lichaamsdeel', difficulty: 'easy' },
  { word: 'BED', clue: 'Slaapmeubel', difficulty: 'easy' },
  { word: 'BIJ', clue: 'Insect dat honing maakt', difficulty: 'easy' },
  { word: 'BUS', clue: 'Openbaar vervoer', difficulty: 'easy' },
  { word: 'DAG', clue: '24 uur', difficulty: 'easy' },
  { word: 'DAS', clue: 'Stropdas of dier', difficulty: 'easy' },
  { word: 'EI', clue: 'Kippenproduct', difficulty: 'easy' },
  { word: 'GAT', clue: 'Opening', difficulty: 'easy' },
  { word: 'HOK', clue: 'Kleine ruimte', difficulty: 'easy' },
  { word: 'JAS', clue: 'Kledingstuk', difficulty: 'easy' },
  { word: 'KAT', clue: 'Huisdier', difficulty: 'easy' },
  { word: 'KIP', clue: 'Pluimvee uit Barneveld', difficulty: 'easy', category: 'lokaal' },
  { word: 'LAP', clue: 'Doek', difficulty: 'easy' },
  { word: 'MES', clue: 'Snijgereedschap', difficulty: 'easy' },
  { word: 'NET', clue: 'Vistuig', difficulty: 'easy' },
  { word: 'OOR', clue: 'Gehoororgaan', difficulty: 'easy' },
  { word: 'PAN', clue: 'Kookgerei', difficulty: 'easy' },
  { word: 'RIT', clue: 'Reis', difficulty: 'easy' },
  { word: 'TAK', clue: 'Deel van boom', difficulty: 'easy' },
  { word: 'VIS', clue: 'Waterdier', difficulty: 'easy' },
  { word: 'WEG', clue: 'Route', difficulty: 'easy' },
  { word: 'ZAK', clue: 'Tas', difficulty: 'easy' },

  // Medium
  { word: 'ARK', clue: 'Schip van Noach', difficulty: 'medium' },
  { word: 'BOA', clue: 'Handhaver of slang', difficulty: 'medium' },
  { word: 'CEL', clue: 'Gevangenis of batterij', difficulty: 'medium' },
  { word: 'DOP', clue: 'Deksel', difficulty: 'medium' },
  { word: 'ERF', clue: 'Stuk grond bij huis', difficulty: 'medium' },
  { word: 'FEE', clue: 'Tovervrouw', difficulty: 'medium' },
  { word: 'GIF', clue: 'Vergif', difficulty: 'medium' },
  { word: 'HAK', clue: 'Schoendeel', difficulty: 'medium' },
  { word: 'IJL', clue: 'Dun', difficulty: 'medium' },
  { word: 'JUK', clue: 'Last', difficulty: 'medium' },
  { word: 'KAR', clue: 'Voertuig', difficulty: 'medium' },
  { word: 'LAG', clue: 'Laag', difficulty: 'medium' },
  { word: 'MAP', clue: 'Opbergmiddel', difficulty: 'medium' },
  { word: 'NIL', clue: 'Nul', difficulty: 'medium' },
  { word: 'ODE', clue: 'Lofdicht', difficulty: 'medium' },
  { word: 'PUL', clue: 'Kruik', difficulty: 'medium' },
  { word: 'RAS', clue: 'Soort', difficulty: 'medium' },
  { word: 'SOP', clue: 'Dunne brij', difficulty: 'medium' },
  { word: 'TOR', clue: 'Kever', difficulty: 'medium' },
  { word: 'URN', clue: 'Vaas voor as', difficulty: 'medium' },
  { word: 'VAT', clue: 'Ton', difficulty: 'medium' },
  { word: 'WIS', clue: 'Zeker', difficulty: 'medium' },
]

// 4-letter woorden
export const fourLetterWords: Word[] = [
  // Easy
  { word: 'APPEL', clue: 'Vrucht', difficulty: 'easy' },
  { word: 'AUTO', clue: 'Voertuig', difficulty: 'easy' },
  { word: 'BEEN', clue: 'Lichaamsdeel', difficulty: 'easy' },
  { word: 'BOEK', clue: 'Leesmateriaal', difficulty: 'easy' },
  { word: 'BOOM', clue: 'Plant met stam', difficulty: 'easy' },
  { word: 'DEUR', clue: 'Ingang', difficulty: 'easy' },
  { word: 'FIETS', clue: 'Tweewieler', difficulty: 'easy' },
  { word: 'GLAS', clue: 'Drinkgerei', difficulty: 'easy' },
  { word: 'HAND', clue: 'Lichaamsdeel', difficulty: 'easy' },
  { word: 'HUIS', clue: 'Woning', difficulty: 'easy' },
  { word: 'JAAR', clue: '365 dagen', difficulty: 'easy' },
  { word: 'KIND', clue: 'Jong mens', difficulty: 'easy' },
  { word: 'KERK', clue: 'Godshuis', difficulty: 'easy' },
  { word: 'LAND', clue: 'Staat', difficulty: 'easy' },
  { word: 'MELK', clue: 'Zuivelproduct', difficulty: 'easy' },
  { word: 'NAAM', clue: 'Benaming', difficulty: 'easy' },
  { word: 'OVEN', clue: 'Bakgereedschap', difficulty: 'easy' },
  { word: 'PAARD', clue: 'Rijdier', difficulty: 'easy' },
  { word: 'RAAM', clue: 'Venster', difficulty: 'easy' },
  { word: 'STAD', clue: 'Grote plaats', difficulty: 'easy' },
  { word: 'TUIN', clue: 'Stuk grond bij huis', difficulty: 'easy' },
  { word: 'VELD', clue: 'Akker', difficulty: 'easy' },
  { word: 'WERK', clue: 'Arbeid', difficulty: 'easy' },
  { word: 'ZOMER', clue: 'Seizoen', difficulty: 'easy' },

  // Medium - Barneveld specifiek
  { word: 'KIPPENHOK', clue: 'Verblijf voor pluimvee', difficulty: 'medium', category: 'lokaal' },
  { word: 'VELUWE', clue: 'Natuurgebied bij Barneveld', difficulty: 'medium', category: 'lokaal' },
  { word: 'MARKT', clue: 'Handelsplaats in centrum', difficulty: 'medium', category: 'lokaal' },
  { word: 'MOLEN', clue: 'Historisch bouwwerk', difficulty: 'medium', category: 'lokaal' },
]

// 5-letter woorden
export const fiveLetterWords: Word[] = [
  // Easy
  { word: 'APPEL', clue: 'Groene of rode vrucht', difficulty: 'easy' },
  { word: 'BLOEM', clue: 'Plant met kleurige blaadjes', difficulty: 'easy' },
  { word: 'BROOD', clue: 'Gebakken deeg', difficulty: 'easy' },
  { word: 'DROOM', clue: 'Nachtelijke fantasie', difficulty: 'easy' },
  { word: 'FEEST', clue: 'Viering', difficulty: 'easy' },
  { word: 'GROEN', clue: 'Kleur van gras', difficulty: 'easy' },
  { word: 'HOOFD', clue: 'Bovenkant lichaam', difficulty: 'easy' },
  { word: 'KAART', clue: 'Landkaart of speelkaart', difficulty: 'easy' },
  { word: 'LICHT', clue: 'Helderheid', difficulty: 'easy' },
  { word: 'MUZIEK', clue: 'Tonen en melodie', difficulty: 'easy' },
  { word: 'NACHT', clue: 'Donkere periode', difficulty: 'easy' },
  { word: 'ONDER', clue: 'Beneden', difficulty: 'easy' },
  { word: 'PLAATS', clue: 'Locatie', difficulty: 'easy' },
  { word: 'REGEN', clue: 'Neerslag', difficulty: 'easy' },
  { word: 'SCHOOL', clue: 'Onderwijsinstelling', difficulty: 'easy' },
  { word: 'TAFEL', clue: 'Meubel', difficulty: 'easy' },
  { word: 'VOGEL', clue: 'Gevleugeld dier', difficulty: 'easy' },
  { word: 'WATER', clue: 'H2O', difficulty: 'easy' },
  { word: 'ZEVEN', clue: 'Getal na zes', difficulty: 'easy' },

  // Medium/Hard
  { word: 'BARNEVELD', clue: 'Kippenstad in Gelderland', difficulty: 'medium', category: 'lokaal' },
  { word: 'SCHAFFELAAR', clue: 'Held uit Barneveld', difficulty: 'hard', category: 'lokaal' },
  { word: 'NAIRAC', clue: 'Museum in Barneveld', difficulty: 'hard', category: 'lokaal' },
]

// Helper functie om woorden op lengte te krijgen
export function getWordsByLength(length: number): Word[] {
  const allWords = [...threeLetterWords, ...fourLetterWords, ...fiveLetterWords]
  return allWords.filter(w => w.word.length === length)
}

// Helper functie om woorden op moeilijkheid te krijgen
export function getWordsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Word[] {
  const allWords = [...threeLetterWords, ...fourLetterWords, ...fiveLetterWords]
  return allWords.filter(w => w.difficulty === difficulty)
}

// Helper functie voor lokale Barneveld woorden
export function getLocalWords(): Word[] {
  const allWords = [...threeLetterWords, ...fourLetterWords, ...fiveLetterWords]
  return allWords.filter(w => w.category === 'lokaal')
}

// Volledig alfabet voor pattern matching
export const DUTCH_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// Common Dutch patterns voor kruiswoord generatie
export const commonPatterns = {
  twoLetter: ['DE', 'HET', 'EEN', 'TE', 'EN', 'OF', 'IN', 'OP', 'AAN', 'UIT'],
  threeLetterEndings: ['ING', 'TJE', 'AAR', 'ERD', 'TER'],
  fourLetterEndings: ['HEID', 'LIJK', 'BAAR', 'LOOS'],
}

const dutchWords = {
  threeLetterWords,
  fourLetterWords,
  fiveLetterWords,
  getWordsByLength,
  getWordsByDifficulty,
  getLocalWords,
}

export default dutchWords