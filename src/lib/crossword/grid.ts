// Grid management voor kruiswoordpuzzels

import { Cell, CrosswordGrid, Word } from './types'

export class Grid {
  private size: number
  private cells: Cell[][]
  private words: { across: Word[]; down: Word[] }
  private wordCounter: number = 1

  constructor(size: number = 15) {
    this.size = size
    this.cells = this.initializeGrid()
    this.words = { across: [], down: [] }
  }

  private initializeGrid(): Cell[][] {
    const grid: Cell[][] = []
    for (let y = 0; y < this.size; y++) {
      const row: Cell[] = []
      for (let x = 0; x < this.size; x++) {
        row.push({
          x,
          y,
          value: '',
          isBlack: false,
          locked: false
        })
      }
      grid.push(row)
    }
    return grid
  }

  // Zet een cel op zwart
  setBlack(x: number, y: number): void {
    if (this.isValidPosition(x, y)) {
      this.cells[y][x].isBlack = true
      this.cells[y][x].value = '#'
    }
  }

  // Verwijder zwart van cel
  clearBlack(x: number, y: number): void {
    if (this.isValidPosition(x, y)) {
      this.cells[y][x].isBlack = false
      this.cells[y][x].value = ''
    }
  }

  // Voeg symmetrische zwarte vakjes toe (standaard kruiswoord patroon)
  addSymmetricalBlack(x: number, y: number): void {
    this.setBlack(x, y)
    // Spiegel horizontaal en verticaal
    const mirrorX = this.size - 1 - x
    const mirrorY = this.size - 1 - y
    this.setBlack(mirrorX, mirrorY)
  }

  // Genereer een basis kruiswoord patroon
  generateBasicPattern(): void {
    // Clear grid first
    this.cells = this.initializeGrid()

    // Voeg enkele strategisch geplaatste zwarte vakjes toe
    // Dit creëert een typisch kruiswoord patroon
    const patterns = [
      // Hoeken
      [0, 3], [0, 7], [0, 11],
      [3, 0], [7, 0], [11, 0],
      // Midden gebied
      [5, 5], [5, 9], [9, 5], [9, 9],
      // Diagonaal
      [3, 3], [11, 11],
      [6, 2], [2, 6], [8, 12], [12, 8]
    ]

    patterns.forEach(([x, y]) => {
      if (x < this.size && y < this.size) {
        this.addSymmetricalBlack(x, y)
      }
    })
  }

  // Zoek alle woorden in het grid
  findWords(): void {
    this.words = { across: [], down: [] }
    this.wordCounter = 1

    // Reset alle nummers
    this.cells.forEach(row => {
      row.forEach(cell => {
        cell.number = undefined
        cell.partOfAcross = undefined
        cell.partOfDown = undefined
      })
    })

    // Vind across en down woorden
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.cells[y][x].isBlack) continue

        const needsNumber = this.isWordStart(x, y, 'across') ||
                           this.isWordStart(x, y, 'down')

        if (needsNumber) {
          this.cells[y][x].number = this.wordCounter

          // Check voor across woord
          if (this.isWordStart(x, y, 'across')) {
            const length = this.getWordLength(x, y, 'across')
            const word: Word = {
              number: this.wordCounter,
              direction: 'across',
              x,
              y,
              length
            }
            this.words.across.push(word)

            // Mark cellen als deel van dit woord
            for (let i = 0; i < length; i++) {
              this.cells[y][x + i].partOfAcross = this.wordCounter
            }
          }

          // Check voor down woord
          if (this.isWordStart(x, y, 'down')) {
            const length = this.getWordLength(x, y, 'down')
            const word: Word = {
              number: this.wordCounter,
              direction: 'down',
              x,
              y,
              length
            }
            this.words.down.push(word)

            // Mark cellen als deel van dit woord
            for (let i = 0; i < length; i++) {
              this.cells[y + i][x].partOfDown = this.wordCounter
            }
          }

          this.wordCounter++
        }
      }
    }
  }

  // Check of positie begin van woord is
  private isWordStart(x: number, y: number, direction: 'across' | 'down'): boolean {
    if (this.cells[y][x].isBlack) return false

    if (direction === 'across') {
      // Begin van across woord als links zwart/rand is en rechts niet zwart is
      const leftBlocked = x === 0 || this.cells[y][x - 1].isBlack
      const rightOpen = x < this.size - 1 && !this.cells[y][x + 1].isBlack
      return leftBlocked && rightOpen
    } else {
      // Begin van down woord als boven zwart/rand is en onder niet zwart is
      const topBlocked = y === 0 || this.cells[y - 1][x].isBlack
      const bottomOpen = y < this.size - 1 && !this.cells[y + 1][x].isBlack
      return topBlocked && bottomOpen
    }
  }

  // Bereken lengte van woord vanaf positie
  private getWordLength(x: number, y: number, direction: 'across' | 'down'): number {
    let length = 0

    if (direction === 'across') {
      while (x + length < this.size && !this.cells[y][x + length].isBlack) {
        length++
      }
    } else {
      while (y + length < this.size && !this.cells[y + length][x].isBlack) {
        length++
      }
    }

    return length
  }

  // Plaats een woord in het grid
  placeWord(word: string, x: number, y: number, direction: 'across' | 'down'): boolean {
    word = word.toUpperCase()

    // Valideer of woord past
    if (direction === 'across') {
      if (x + word.length > this.size) return false

      // Check voor conflicten
      for (let i = 0; i < word.length; i++) {
        const cell = this.cells[y][x + i]
        if (cell.isBlack) return false
        if (cell.value && cell.value !== word[i]) return false
      }

      // Plaats woord
      for (let i = 0; i < word.length; i++) {
        this.cells[y][x + i].value = word[i]
      }
    } else {
      if (y + word.length > this.size) return false

      // Check voor conflicten
      for (let i = 0; i < word.length; i++) {
        const cell = this.cells[y + i][x]
        if (cell.isBlack) return false
        if (cell.value && cell.value !== word[i]) return false
      }

      // Plaats woord
      for (let i = 0; i < word.length; i++) {
        this.cells[y + i][x].value = word[i]
      }
    }

    return true
  }

  // Helper functie voor validatie
  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.size && y >= 0 && y < this.size
  }

  // Get cell op positie
  getCell(x: number, y: number): Cell | null {
    if (!this.isValidPosition(x, y)) return null
    return this.cells[y][x]
  }

  // Export grid data
  toJSON(): CrosswordGrid {
    return {
      size: this.size,
      cells: this.cells,
      words: this.words
    }
  }

  // Get oplossing (alle letters)
  getSolution(): string[][] {
    return this.cells.map(row =>
      row.map(cell => cell.isBlack ? '#' : cell.value || '')
    )
  }

  // Clear alle letters maar behoud structuur
  clearLetters(): void {
    this.cells.forEach(row => {
      row.forEach(cell => {
        if (!cell.isBlack) {
          cell.value = ''
        }
      })
    })
  }

  // Statistieken
  getStatistics() {
    let blackCount = 0
    let letterCount = 0
    let filledCount = 0

    this.cells.forEach(row => {
      row.forEach(cell => {
        if (cell.isBlack) {
          blackCount++
        } else {
          letterCount++
          if (cell.value) filledCount++
        }
      })
    })

    return {
      totalCells: this.size * this.size,
      blackSquares: blackCount,
      letterSquares: letterCount,
      filledSquares: filledCount,
      blackPercentage: (blackCount / (this.size * this.size)) * 100,
      fillPercentage: (filledCount / letterCount) * 100,
      totalWords: this.words.across.length + this.words.down.length,
      acrossWords: this.words.across.length,
      downWords: this.words.down.length
    }
  }
}

export default Grid