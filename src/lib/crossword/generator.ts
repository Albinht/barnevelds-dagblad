// Kruiswoordpuzzel generator
// Voor v1 gebruiken we voorgedefinieerde templates voor betrouwbaarheid

import { CrosswordPuzzle, GeneratorOptions } from './types'
import Grid from './grid'
import {
  threeLetterWords,
  fourLetterWords,
  fiveLetterWords,
  getWordsByDifficulty,
  getLocalWords
} from '@/data/crossword/dutch-words'

// Voorgedefinieerde puzzle templates voor verschillende moeilijkheidsgraden
// Deze zijn handmatig getest en gebalanceerd
const puzzleTemplates = {
  easy: {
    size: 9,
    pattern: [
      'L L L # L L L L L',
      'L L L # L L L L L',
      'L L L # L L L L L',
      '# # # L L L # # #',
      'L L L L L L L L L',
      '# # # L L L # # #',
      'L L L L L # L L L',
      'L L L L L # L L L',
      'L L L L L # L L L'
    ],
    words: {
      across: [
        { num: 1, x: 0, y: 0, len: 3 },
        { num: 4, x: 4, y: 0, len: 5 },
        { num: 5, x: 0, y: 1, len: 3 },
        { num: 6, x: 4, y: 1, len: 5 },
        { num: 7, x: 0, y: 2, len: 3 },
        { num: 8, x: 4, y: 2, len: 5 },
        { num: 9, x: 3, y: 3, len: 3 },
        { num: 10, x: 0, y: 4, len: 9 },
        { num: 11, x: 3, y: 5, len: 3 },
        { num: 12, x: 0, y: 6, len: 5 },
        { num: 13, x: 6, y: 6, len: 3 },
        { num: 14, x: 0, y: 7, len: 5 },
        { num: 15, x: 6, y: 7, len: 3 },
        { num: 16, x: 0, y: 8, len: 5 },
        { num: 17, x: 6, y: 8, len: 3 }
      ],
      down: [
        { num: 1, x: 0, y: 0, len: 3 },
        { num: 2, x: 1, y: 0, len: 3 },
        { num: 3, x: 2, y: 0, len: 3 },
        { num: 4, x: 4, y: 0, len: 5 },
        { num: 5, x: 5, y: 0, len: 5 },
        { num: 6, x: 6, y: 0, len: 3 },
        { num: 7, x: 7, y: 0, len: 3 },
        { num: 8, x: 8, y: 0, len: 3 },
        { num: 9, x: 3, y: 3, len: 3 },
        { num: 10, x: 0, y: 4, len: 5 },
        { num: 11, x: 1, y: 4, len: 5 },
        { num: 12, x: 2, y: 4, len: 5 },
        { num: 13, x: 6, y: 6, len: 3 },
        { num: 14, x: 7, y: 6, len: 3 },
        { num: 15, x: 8, y: 6, len: 3 }
      ]
    }
  },
  medium: {
    size: 13,
    pattern: [
      'L L L L # L L L # L L L L',
      'L L L L # L L L # L L L L',
      'L L L L # L L L # L L L L',
      'L L L L L L L L L L L L L',
      '# # # L L L # L L L # # #',
      'L L L L L # # # L L L L L',
      'L L L # # # # # # # L L L',
      'L L L L L # # # L L L L L',
      '# # # L L L # L L L # # #',
      'L L L L L L L L L L L L L',
      'L L L L # L L L # L L L L',
      'L L L L # L L L # L L L L',
      'L L L L # L L L # L L L L'
    ]
  },
  hard: {
    size: 15,
    pattern: [
      'L L L L L # L L L # L L L L L',
      'L L L L L # L L L # L L L L L',
      'L L L L L # L L L # L L L L L',
      'L L L L L L L L L L L L L L L',
      'L L L # # # L L L # # # L L L',
      '# # # L L L # L # L L L # # #',
      'L L L L L # # # # # L L L L L',
      'L L L # # # # # # # # # L L L',
      'L L L L L # # # # # L L L L L',
      '# # # L L L # L # L L L # # #',
      'L L L # # # L L L # # # L L L',
      'L L L L L L L L L L L L L L L',
      'L L L L L # L L L # L L L L L',
      'L L L L L # L L L # L L L L L',
      'L L L L L # L L L # L L L L L'
    ]
  }
}

export class CrosswordGenerator {
  private options: GeneratorOptions
  private grid: Grid

  constructor(options: GeneratorOptions = {}) {
    this.options = {
      size: 15,
      difficulty: 'medium',
      symmetrical: true,
      minWordLength: 3,
      maxWordLength: 9,
      blackSquareRatio: 0.2,
      useLocalWords: true,
      ...options
    }
    this.grid = new Grid(this.options.size)
  }

  // Genereer een complete puzzel
  async generate(): Promise<CrosswordPuzzle> {
    const difficulty = this.options.difficulty || 'medium'

    // Voor v1: gebruik een template gebaseerd op moeilijkheid
    const template = this.getRandomTemplate(difficulty)

    // Maak grid van template
    this.createGridFromTemplate(template)

    // Vul grid met woorden
    const filled = await this.fillGrid(difficulty)

    if (!filled) {
      throw new Error('Kon geen geldige puzzel genereren. Probeer opnieuw.')
    }

    // Genereer clues
    const clues = this.generateClues()

    // Maak puzzle object
    const puzzle: CrosswordPuzzle = {
      title: this.generateTitle(),
      difficulty,
      gridSize: this.grid.toJSON().size,
      grid: this.grid.toJSON(),
      clues,
      solution: this.grid.getSolution()
    }

    return puzzle
  }

  // Krijg een random template voor difficulty
  private getRandomTemplate(difficulty: 'easy' | 'medium' | 'hard') {
    // Voor v1 gebruiken we de basis templates
    // Later kunnen we meer variatie toevoegen
    const template = puzzleTemplates[difficulty]

    // Maak een kopie om mutatie te voorkomen
    return JSON.parse(JSON.stringify(template))
  }

  // Maak grid van template pattern
  private createGridFromTemplate(template: any): void {
    const size = template.size
    this.grid = new Grid(size)

    // Parse pattern en zet zwarte vakjes
    template.pattern.forEach((row: string, y: number) => {
      const cells = row.split(' ')
      cells.forEach((cell: string, x: number) => {
        if (cell === '#') {
          this.grid.setBlack(x, y)
        }
      })
    })

    // Zoek woorden in het grid
    this.grid.findWords()
  }

  // Vul het grid met woorden
  private async fillGrid(difficulty: 'easy' | 'medium' | 'hard'): Promise<boolean> {
    const words = this.grid.toJSON().words
    const wordList = getWordsByDifficulty(difficulty)

    // Shuffle word list voor variatie
    const shuffled = [...wordList].sort(() => Math.random() - 0.5)

    // Probeer across woorden te plaatsen
    for (const word of words.across) {
      const fitting = shuffled.filter(w => w.word.length === word.length)
      if (fitting.length > 0) {
        const selected = fitting[Math.floor(Math.random() * fitting.length)]
        this.grid.placeWord(selected.word, word.x, word.y, 'across')
      }
    }

    // Probeer down woorden te plaatsen (met cross-checking)
    for (const word of words.down) {
      const fitting = shuffled.filter(w => {
        if (w.word.length !== word.length) return false

        // Check of het past met bestaande letters
        for (let i = 0; i < w.word.length; i++) {
          const cell = this.grid.getCell(word.x, word.y + i)
          if (cell?.value && cell.value !== w.word[i]) {
            return false
          }
        }
        return true
      })

      if (fitting.length > 0) {
        const selected = fitting[Math.floor(Math.random() * fitting.length)]
        this.grid.placeWord(selected.word, word.x, word.y, 'down')
      }
    }

    // Check of grid voldoende gevuld is (minimaal 80%)
    const stats = this.grid.getStatistics()
    return stats.fillPercentage >= 80
  }

  // Genereer clues voor de woorden
  private generateClues() {
    const gridData = this.grid.toJSON()
    const solution = this.grid.getSolution()
    const allWords = [
      ...threeLetterWords,
      ...fourLetterWords,
      ...fiveLetterWords
    ]

    const clues = {
      across: [] as { number: number; clue: string }[],
      down: [] as { number: number; clue: string }[]
    }

    // Genereer across clues
    gridData.words.across.forEach(word => {
      const letters: string[] = []
      for (let i = 0; i < word.length; i++) {
        letters.push(solution[word.y][word.x + i])
      }
      const wordStr = letters.join('')

      // Zoek clue voor dit woord
      const wordData = allWords.find(w => w.word === wordStr)
      clues.across.push({
        number: word.number,
        clue: wordData?.clue || `${word.length} letters`
      })
    })

    // Genereer down clues
    gridData.words.down.forEach(word => {
      const letters: string[] = []
      for (let i = 0; i < word.length; i++) {
        letters.push(solution[word.y + i][word.x])
      }
      const wordStr = letters.join('')

      // Zoek clue voor dit woord
      const wordData = allWords.find(w => w.word === wordStr)
      clues.down.push({
        number: word.number,
        clue: wordData?.clue || `${word.length} letters`
      })
    })

    return clues
  }

  // Genereer een titel voor de puzzel
  private generateTitle(): string {
    const themes = [
      'Dagelijkse Kruiswoordpuzzel',
      'Barneveldse Breinbreker',
      'Kruiswoord van de Dag',
      'Woordpuzzel Uitdaging',
      'Taalkunst Kruiswoord'
    ]

    const date = new Date().toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    const theme = themes[Math.floor(Math.random() * themes.length)]
    return `${theme} - ${date}`
  }

  // Valideer een complete puzzel
  validatePuzzle(puzzle: CrosswordPuzzle): boolean {
    // Check of alle woorden gevuld zijn
    const grid = puzzle.grid
    let allFilled = true

    grid.cells.forEach(row => {
      row.forEach(cell => {
        if (!cell.isBlack && !cell.value) {
          allFilled = false
        }
      })
    })

    // Check of alle clues aanwezig zijn
    const hasAllClues =
      puzzle.clues.across.length === grid.words.across.length &&
      puzzle.clues.down.length === grid.words.down.length

    return allFilled && hasAllClues
  }
}

// Singleton instance voor hergebruik
let generatorInstance: CrosswordGenerator | null = null

export function getGenerator(options?: GeneratorOptions): CrosswordGenerator {
  if (!generatorInstance || options) {
    generatorInstance = new CrosswordGenerator(options)
  }
  return generatorInstance
}

export default CrosswordGenerator