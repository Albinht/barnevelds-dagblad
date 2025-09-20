// Type definities voor het kruiswoord systeem

export type CellType = 'letter' | 'black' | 'number'

export interface Cell {
  x: number
  y: number
  value: string // letter of leeg
  number?: number // clue nummer
  isBlack: boolean
  partOfAcross?: number // nummer van across woord
  partOfDown?: number // nummer van down woord
  locked?: boolean // voor pre-filled cellen
}

export interface Word {
  number: number
  direction: 'across' | 'down'
  x: number
  y: number
  length: number
  word?: string
  clue?: string
}

export interface CrosswordGrid {
  size: number
  cells: Cell[][]
  words: {
    across: Word[]
    down: Word[]
  }
}

export interface CrosswordPuzzle {
  id?: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  gridSize: number
  grid: CrosswordGrid
  clues: {
    across: { number: number; clue: string }[]
    down: { number: number; clue: string }[]
  }
  solution: string[][]
  publishDate?: Date
  metadata?: {
    author?: string
    theme?: string
    averageTime?: number
  }
}

export interface GeneratorOptions {
  size?: number // default 15
  difficulty?: 'easy' | 'medium' | 'hard'
  theme?: string
  symmetrical?: boolean // default true
  minWordLength?: number // default 3
  maxWordLength?: number // default 9
  blackSquareRatio?: number // default 0.2 (20%)
  useLocalWords?: boolean // gebruik Barneveld woorden
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  statistics: {
    totalWords: number
    averageWordLength: number
    blackSquarePercentage: number
    intersectionCount: number
  }
}