'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Clock, RefreshCw, HelpCircle, Share2, Printer, Trophy } from 'lucide-react'

interface CellData {
  letter: string
  number?: number
  isBlack: boolean
  row: number
  col: number
  partOfAcross?: number
  partOfDown?: number
}

interface CrosswordProps {
  puzzleId?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  onComplete?: (score: number, time: number) => void
}

// Demo puzzels voor verschillende moeilijkheidsgraden
const puzzlesByDifficulty = {
  easy: {
    id: 'easy-2024-01-19',
    title: 'Barneveldse Breinbreker - Makkelijk',
    difficulty: 'easy' as const,
    grid: [
      ['K', 'I', 'P', '#', 'B', 'O', 'O', 'M', 'S'],
      ['A', 'A', 'P', '#', 'A', 'U', 'T', 'O', 'S'],
      ['T', 'A', 'S', '#', 'R', 'A', 'A', 'M', 'S'],
      ['#', '#', '#', 'D', 'A', 'S', '#', '#', '#'],
      ['H', 'U', 'I', 'S', 'V', 'E', 'L', 'D', 'E'],
      ['#', '#', '#', 'J', 'E', 'T', '#', '#', '#'],
      ['B', 'R', 'O', 'O', 'D', '#', 'W', 'E', 'G'],
      ['L', 'O', 'O', 'N', 'S', '#', 'I', 'J', 'S'],
      ['O', 'O', 'R', 'D', 'E', '#', 'N', 'E', 'T'],
    ],
    numbers: [
      [1, null, null, null, 4, null, null, null, null],
      [5, null, null, null, 6, null, null, null, null],
      [7, null, null, null, 8, null, null, null, null],
      [null, null, null, 9, null, null, null, null, null],
      [10, null, null, null, null, null, null, null, null],
      [null, null, null, 11, null, null, null, null, null],
      [12, null, null, null, null, null, 13, null, null],
      [14, null, null, null, null, null, 15, null, null],
      [16, null, null, null, null, null, 17, null, null],
    ],
    clues: {
      across: {
        1: 'Pluimvee uit Barneveld (3)',
        4: 'Meervoud van boom (5)',
        5: 'Primaat (3)',
        6: 'Voertuigen (5)',
        7: 'Draagbaar voorwerp (3)',
        8: 'Vensters (5)',
        9: 'Stropdas of dier (3)',
        10: 'Woning met akker (9)',
        11: 'Straaljager (3)',
        12: 'Gebakken deeg (5)',
        13: 'Route (3)',
        14: 'Salaris (5)',
        15: 'IJs op water (3)',
        16: 'Regelmaat (5)',
        17: 'Vistuig (3)',
      },
      down: {
        1: 'Huisdier (3)',
        2: 'Internationale Arbeidsorganisatie (3)',
        3: 'Postscriptum (2)',
        4: 'Gelderland stad (5)',
        5: 'Ouden van dagen (3)',
        6: 'Gehoororgaan (3)',
        7: 'Waterlelie (3)',
        8: 'Samenvoeging (3)',
        9: 'Speelgoed (3)',
        10: 'Handvat (5)',
        11: 'Loondienst (5)',
        12: 'Bestelling (5)',
        13: 'Windrichting (3)',
        14: 'IJs van binnen (2)',
        15: 'Zeebodem (3)',
      }
    }
  },
  medium: {
    id: 'medium-2024-01-19',
    title: 'Nederlandse Puzzel - Gemiddeld',
    difficulty: 'medium' as const,
    grid: [
      ['V', 'O', 'G', 'E', 'L', '#', '#', 'K', 'A', 'A', 'S'],
      ['E', '#', '#', '#', 'A', '#', '#', 'O', '#', '#', 'T'],
      ['L', '#', 'B', 'O', 'N', 'D', '#', 'E', '#', '#', 'A'],
      ['D', '#', 'O', '#', 'D', '#', '#', 'K', 'A', 'N', 'D'],
      ['#', '#', 'E', '#', '#', '#', '#', '#', '#', 'E', '#'],
      ['W', 'A', 'T', 'E', 'R', '#', 'B', 'R', 'O', 'E', 'K'],
      ['#', '#', '#', '#', '#', '#', '#', 'E', '#', 'R', '#'],
      ['P', 'A', 'R', 'K', '#', '#', '#', 'I', '#', '#', '#'],
      ['A', '#', '#', 'I', '#', '#', 'Z', 'S', 'O', 'N', '#'],
      ['A', '#', '#', 'N', 'A', 'C', 'H', '#', '#', 'E', '#'],
      ['R', 'E', 'G', 'D', '#', '#', 'T', '#', '#', 'T', '#'],
    ],
    numbers: [
      [1, null, null, null, null, null, null, 2, null, null, null],
      [3, null, null, null, null, null, null, null, null, null, null],
      [4, null, 5, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, 6, null, null, null],
      [null, null, null, null, null, null, null, null, null, null, null],
      [7, null, null, null, null, null, 8, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null, null],
      [9, null, null, null, null, null, null, null, null, null, null],
      [10, null, null, null, null, null, 11, null, null, null, null],
      [null, null, null, 12, null, null, null, null, null, null, null],
      [13, null, null, null, null, null, null, null, null, null, null],
    ],
    clues: {
      across: {
        1: 'Dier met vleugels (5)',
        2: 'Melkproduct (4)',
        3: 'Akker (4)',
        4: 'Planeet aarde (5)',
        5: 'Vereniging (4)',
        6: 'Waterkoker (4)',
        7: 'H2O (5)',
        8: 'Pantalon (5)',
        9: 'Groengebied in stad (4)',
        10: 'Dubbel (4)',
        11: 'Dochterszoon (4)',
        12: 'Duisternis (5)',
        13: 'Neerslag (3)',
      },
      down: {
        1: 'Gebied (4)',
        2: 'Kookgerei (6)',
        3: 'Oude munt (3)',
        4: 'Krant (4)',
        5: 'Schoeisel (4)',
        6: 'Bakker (5)',
        7: 'Oorlogvoering (5)',
        8: 'Bedekking (4)',
        9: 'Dubbel (4)',
        10: 'Kunstwerk (4)',
        11: 'Licht (5)',
        12: 'Soort (4)',
      }
    }
  },
  hard: {
    id: 'hard-2024-01-19',
    title: 'Expert Puzzel - Moeilijk',
    difficulty: 'hard' as const,
    grid: [
      ['S', 'C', 'H', 'I', 'L', 'D', 'E', 'R', '#', 'A', 'P', 'O', 'S'],
      ['T', '#', '#', '#', '#', '#', '#', 'E', '#', 'R', '#', '#', 'T'],
      ['R', '#', 'V', 'E', 'R', 'K', 'E', 'E', 'R', 'T', '#', '#', 'E'],
      ['A', '#', 'O', '#', '#', '#', '#', 'D', '#', 'I', '#', '#', 'L'],
      ['T', 'H', 'O', 'R', 'I', 'U', 'M', '#', '#', 'K', 'L', 'O', 'K'],
      ['E', '#', 'R', '#', '#', '#', '#', '#', '#', 'E', '#', '#', '#'],
      ['G', '#', 'B', 'A', 'L', 'K', 'O', 'N', '#', 'L', '#', '#', '#'],
      ['I', '#', 'E', '#', '#', '#', '#', 'A', '#', '#', '#', '#', '#'],
      ['E', 'L', 'E', 'K', 'T', 'R', 'O', 'N', 'I', 'C', 'A', '#', '#'],
      ['#', '#', 'L', '#', '#', '#', '#', 'D', '#', 'U', '#', '#', '#'],
      ['#', '#', 'D', '#', 'G', 'E', 'E', 'S', 'T', 'R', 'I', 'F', 'T'],
      ['#', '#', '#', '#', 'A', '#', '#', '#', '#', 'C', '#', '#', '#'],
      ['#', '#', '#', '#', 'S', 'T', 'A', 'T', 'I', 'O', 'N', '#', '#'],
    ],
    numbers: [
      [1, null, null, null, null, null, null, null, null, 2, null, null, null],
      [3, null, null, null, null, null, null, null, null, null, null, null, null],
      [4, null, 5, null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      [6, null, null, null, null, null, null, null, null, 7, null, null, null],
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      [8, null, 9, null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      [10, null, null, null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, 11, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, 12, null, null, null, null, null, null, null, null],
    ],
    clues: {
      across: {
        1: 'Kunstenaar (8)',
        2: 'Verlaten (4)',
        3: 'Plan (9)',
        4: 'Fout (8)',
        5: 'Omgekeerd (8)',
        6: 'Radioactief element (7)',
        7: 'Uurwerk (4)',
        8: 'Galerij (6)',
        9: 'Uitstekend deel gebouw (6)',
        10: 'Technologie (11)',
        11: 'Intellect (9)',
        12: 'Halte (7)',
      },
      down: {
        1: 'Tactiek (9)',
        2: 'Schrijver (6)',
        3: 'Vooruitgang (8)',
        4: 'Toonbeeld (5)',
        5: 'Resultaat (9)',
        6: 'Gesprek (8)',
        7: 'Constructie (9)',
        8: 'Benzine (8)',
        9: 'Vloer (5)',
        10: 'Elektrisch (10)',
        11: 'Brandstof (3)',
        12: 'Stellage (7)',
      }
    }
  }
}

export default function BDCrossword({
  puzzleId,
  difficulty = 'easy',
  onComplete
}: CrosswordProps) {
  const [puzzle, setPuzzle] = useState(puzzlesByDifficulty[difficulty])
  const [grid, setGrid] = useState<CellData[][]>([])
  const [userGrid, setUserGrid] = useState<string[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [direction, setDirection] = useState<'across' | 'down'>('across')
  const [isComplete, setIsComplete] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([])

  const size = puzzle.grid.length

  // Update puzzle when difficulty changes
  useEffect(() => {
    setPuzzle(puzzlesByDifficulty[difficulty])
    setSelectedCell(null)
    setDirection('across')
    setIsComplete(false)
    setHintsUsed(0)
  }, [difficulty])

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && !isComplete) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime, isPaused, isComplete])

  // Initialize grid
  useEffect(() => {
    const newGrid: CellData[][] = []
    const newUserGrid: string[][] = []
    const refs: (HTMLInputElement | null)[][] = []

    for (let row = 0; row < size; row++) {
      const gridRow: CellData[] = []
      const userRow: string[] = []
      const refRow: (HTMLInputElement | null)[] = []

      for (let col = 0; col < size; col++) {
        const isBlack = puzzle.grid[row][col] === '#'
        gridRow.push({
          letter: isBlack ? '#' : '',
          number: puzzle.numbers[row][col] || undefined,
          isBlack,
          row,
          col
        })
        userRow.push('')
        refRow.push(null)
      }
      newGrid.push(gridRow)
      newUserGrid.push(userRow)
      refs.push(refRow)
    }

    // Find which cells belong to which words - BULLETPROOF VERSION
    // First pass: identify all across words
    for (let row = 0; row < size; row++) {
      let wordStart = -1
      let wordNum = null

      for (let col = 0; col < size; col++) {
        if (newGrid[row][col].isBlack) {
          wordStart = -1
          wordNum = null
        } else {
          // Start of a new word?
          if (wordStart === -1) {
            wordStart = col
            wordNum = newGrid[row][col].number || null
          }

          // Assign the word number to this cell
          newGrid[row][col].partOfAcross = wordNum || `across_${row}_${wordStart}`
        }
      }
    }

    // Second pass: identify all down words
    for (let col = 0; col < size; col++) {
      let wordStart = -1
      let wordNum = null

      for (let row = 0; row < size; row++) {
        if (newGrid[row][col].isBlack) {
          wordStart = -1
          wordNum = null
        } else {
          // Start of a new word?
          if (wordStart === -1) {
            wordStart = row
            wordNum = newGrid[row][col].number || null
          }

          // Assign the word number to this cell
          newGrid[row][col].partOfDown = wordNum || `down_${wordStart}_${col}`
        }
      }
    }

    setGrid(newGrid)
    setUserGrid(newUserGrid)
    inputRefs.current = refs
  }, [size, puzzle])

  // Calculate score
  const calculateScore = useCallback(() => {
    let correct = 0
    let total = 0
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!grid[row]?.[col]?.isBlack) {
          total++
          if (userGrid[row]?.[col] === puzzle.grid[row][col]) {
            correct++
          }
        }
      }
    }

    // Base score from correct answers
    let score = Math.round((correct / Math.max(total, 1)) * 100)

    // Time bonus (lose 1 point per 30 seconds)
    const timeDeduction = Math.floor(elapsedTime / 30)
    score = Math.max(0, score - timeDeduction)

    // Hint penalty (lose 5 points per hint)
    score = Math.max(0, score - (hintsUsed * 5))

    return score
  }, [userGrid, grid, puzzle, size, elapsedTime, hintsUsed])

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number, shouldToggle: boolean = true, forceDirection?: 'across' | 'down') => {
    if (grid[row]?.[col]?.isBlack) return

    // Als een direction wordt geforceerd, gebruik die
    if (forceDirection) {
      setDirection(forceDirection)
      setSelectedCell({ row, col })
    } else if (selectedCell?.row === row && selectedCell?.col === col && shouldToggle) {
      setDirection(d => d === 'across' ? 'down' : 'across')
    } else {
      setSelectedCell({ row, col })
    }

    inputRefs.current[row]?.[col]?.focus()
  }, [grid, selectedCell])

  // Handle input
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const value = e.target.value.toUpperCase()
    if (value.length > 1) return

    const newUserGrid = [...userGrid]
    newUserGrid[row][col] = value
    setUserGrid(newUserGrid)

    if (value && value.match(/[A-Z]/)) {
      if (direction === 'across') {
        let newCol = col + 1
        while (newCol < size && grid[row][newCol]?.isBlack) newCol++
        if (newCol < size) {
          setSelectedCell({ row, col: newCol })
          setTimeout(() => inputRefs.current[row]?.[newCol]?.focus(), 0)
        }
      } else {
        let newRow = row + 1
        while (newRow < size && grid[newRow]?.[col]?.isBlack) newRow++
        if (newRow < size) {
          setSelectedCell({ row: newRow, col })
          setTimeout(() => inputRefs.current[newRow]?.[col]?.focus(), 0)
        }
      }
    }

    checkCompletion(newUserGrid)
  }, [userGrid, direction, grid, size])

  // Handle keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === ' ') {
      e.preventDefault()
      setDirection(d => d === 'across' ? 'down' : 'across')
    } else if (e.key === 'Backspace' && !userGrid[row][col]) {
      e.preventDefault()
      if (direction === 'across') {
        let newCol = col - 1
        while (newCol >= 0 && grid[row][newCol]?.isBlack) newCol--
        if (newCol >= 0) {
          setSelectedCell({ row, col: newCol })
          inputRefs.current[row]?.[newCol]?.focus()
        }
      } else {
        let newRow = row - 1
        while (newRow >= 0 && grid[newRow]?.[col]?.isBlack) newRow--
        if (newRow >= 0) {
          setSelectedCell({ row: newRow, col })
          inputRefs.current[newRow]?.[col]?.focus()
        }
      }
    }
  }, [grid, userGrid, direction])

  // Check completion
  const checkCompletion = (currentUserGrid: string[][]) => {
    let complete = true
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!grid[row][col].isBlack) {
          if (currentUserGrid[row][col] !== puzzle.grid[row][col]) {
            complete = false
            break
          }
        }
      }
      if (!complete) break
    }

    if (complete && !isComplete) {
      setIsComplete(true)
      const finalScore = calculateScore()
      onComplete?.(finalScore, elapsedTime)
    }
  }

  // Get hint
  const getHint = () => {
    if (!selectedCell) return
    const { row, col } = selectedCell
    const newUserGrid = [...userGrid]
    newUserGrid[row][col] = puzzle.grid[row][col]
    setUserGrid(newUserGrid)
    setHintsUsed(h => h + 1)
    checkCompletion(newUserGrid)
  }

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get highlighted cells
  const getHighlightedCells = () => {
    const highlighted = new Set<string>()
    if (!selectedCell) return highlighted

    const { row, col } = selectedCell

    if (direction === 'across') {
      const wordNum = grid[row][col].partOfAcross
      for (let c = 0; c < size; c++) {
        if (grid[row][c].partOfAcross === wordNum) {
          highlighted.add(`${row}-${c}`)
        }
      }
    } else {
      const wordNum = grid[row][col].partOfDown
      for (let r = 0; r < size; r++) {
        if (grid[r][col].partOfDown === wordNum) {
          highlighted.add(`${r}-${col}`)
        }
      }
    }

    return highlighted
  }

  const highlightedCells = getHighlightedCells()

  // Get current clue
  const getCurrentClue = () => {
    if (!selectedCell) return null
    const { row, col } = selectedCell

    if (direction === 'across') {
      const clueNumber = grid[row][col].partOfAcross
      if (clueNumber && puzzle.clues.across[clueNumber]) {
        return { number: clueNumber, text: puzzle.clues.across[clueNumber], direction: 'Horizontaal' }
      }
    } else {
      const clueNumber = grid[row][col].partOfDown
      if (clueNumber && puzzle.clues.down[clueNumber]) {
        return { number: clueNumber, text: puzzle.clues.down[clueNumber], direction: 'Verticaal' }
      }
    }
    return null
  }

  const currentClue = getCurrentClue()

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-brand-blue text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-newspaper">{puzzle.title}</h1>
            <p className="text-sm opacity-90">
              {new Date().toLocaleDateString('nl-NL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm opacity-90">Moeilijkheid</p>
              <p className="font-bold">
                {difficulty === 'easy' && 'Makkelijk'}
                {difficulty === 'medium' && 'Gemiddeld'}
                {difficulty === 'hard' && 'Moeilijk'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Score</p>
              <p className="text-2xl font-bold">{calculateScore()}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timer and Controls */}
      <div className="bg-gray-100 p-3 border-x">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-blue" />
              <span className="font-bold text-lg">{formatTime(elapsedTime)}</span>
            </div>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1 bg-white rounded hover:bg-gray-50 text-sm"
            >
              {isPaused ? 'Hervat' : 'Pauze'}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={getHint}
              className="flex items-center gap-1 px-3 py-1 bg-brand-yellow text-black rounded hover:opacity-90"
              disabled={!selectedCell}
            >
              <HelpCircle className="w-4 h-4" />
              Hint ({hintsUsed})
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 px-3 py-1 bg-white rounded hover:bg-gray-50"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {/* Implement share */}}
              className="flex items-center gap-1 px-3 py-1 bg-white rounded hover:bg-gray-50"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Current Clue */}
      {currentClue && (
        <div className="bg-brand-yellow p-3 border-x">
          <p className="font-bold text-center">
            {currentClue.number} {currentClue.direction}: {currentClue.text}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white border rounded-b-lg p-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Crossword Grid */}
          <div className="lg:col-span-2 flex justify-center">
            <div
              className="inline-block border-2 border-gray-900"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${size}, 48px)`,
                gridTemplateRows: `repeat(${size}, 48px)`,
                gap: '1px',
                backgroundColor: '#e5e7eb'
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                  const isHighlighted = highlightedCells.has(`${rowIndex}-${colIndex}`)
                  const hasError = showErrors && userGrid[rowIndex]?.[colIndex] &&
                                  userGrid[rowIndex][colIndex] !== puzzle.grid[rowIndex][colIndex]

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        relative w-12 h-12 transition-colors
                        ${cell.isBlack ? 'bg-gray-900' : 'bg-white'}
                        ${isHighlighted && !isSelected ? 'bg-brand-yellow bg-opacity-30' : ''}
                        ${isSelected ? 'bg-brand-yellow bg-opacity-60 ring-2 ring-brand-blue' : ''}
                      `}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {!cell.isBlack && (
                        <>
                          {cell.number && (
                            <span className="absolute top-0.5 left-1 text-xs font-bold text-brand-blue">
                              {cell.number}
                            </span>
                          )}
                          <input
                            ref={(el) => {
                              if (!inputRefs.current[rowIndex]) {
                                inputRefs.current[rowIndex] = []
                              }
                              inputRefs.current[rowIndex][colIndex] = el
                            }}
                            type="text"
                            value={userGrid[rowIndex]?.[colIndex] || ''}
                            onChange={(e) => handleInput(e, rowIndex, colIndex)}
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                            onFocus={() => handleCellClick(rowIndex, colIndex, false)}
                            className={`
                              w-full h-full text-center text-xl font-bold bg-transparent
                              outline-none cursor-pointer pt-3
                              ${hasError ? 'text-brand-darkred' : ''}
                            `}
                            maxLength={1}
                            autoComplete="off"
                            disabled={isPaused}
                          />
                        </>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Clues */}
          <div className="space-y-6">
            {/* Direction Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setDirection('across')}
                className={`flex-1 py-2 px-3 rounded font-semibold transition-colors ${
                  direction === 'across'
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                → Horizontaal
              </button>
              <button
                onClick={() => setDirection('down')}
                className={`flex-1 py-2 px-3 rounded font-semibold transition-colors ${
                  direction === 'down'
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                ↓ Verticaal
              </button>
            </div>

            {/* Across Clues */}
            <div>
              <h3 className="font-bold text-lg mb-3 text-brand-blue">Horizontaal</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {Object.entries(puzzle.clues.across).map(([num, clue]) => {
                  const clueNum = parseInt(num)
                  const isActive = direction === 'across' && selectedCell &&
                    grid[selectedCell.row][selectedCell.col].partOfAcross === clueNum

                  return (
                    <div
                      key={num}
                      className={`
                        p-2 rounded cursor-pointer text-sm transition-all
                        ${isActive
                          ? 'bg-brand-yellow font-semibold shadow-sm'
                          : 'hover:bg-gray-100'
                        }
                      `}
                      onClick={() => {
                        // Zoek de cell en gebruik forceDirection
                        for (let r = 0; r < size; r++) {
                          for (let c = 0; c < size; c++) {
                            if (grid[r][c].number === clueNum) {
                              // Gebruik handleCellClick met forceDirection
                              handleCellClick(r, c, false, 'across')
                              return
                            }
                          }
                        }
                      }}
                    >
                      <span className="font-bold text-brand-blue">{num}.</span> {clue}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Down Clues */}
            <div>
              <h3 className="font-bold text-lg mb-3 text-brand-blue">Verticaal</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {Object.entries(puzzle.clues.down).map(([num, clue]) => {
                  const clueNum = parseInt(num)
                  const isActive = direction === 'down' && selectedCell &&
                    grid[selectedCell.row][selectedCell.col].partOfDown === clueNum

                  return (
                    <div
                      key={num}
                      className={`
                        p-2 rounded cursor-pointer text-sm transition-all
                        ${isActive
                          ? 'bg-brand-yellow font-semibold shadow-sm'
                          : 'hover:bg-gray-100'
                        }
                      `}
                      onClick={() => {
                        // Zoek de cell en gebruik forceDirection
                        for (let r = 0; r < size; r++) {
                          for (let c = 0; c < size; c++) {
                            if (grid[r][c].number === clueNum) {
                              // Gebruik handleCellClick met forceDirection
                              handleCellClick(r, c, false, 'down')
                              return
                            }
                          }
                        }
                      }}
                    >
                      <span className="font-bold text-brand-blue">{num}.</span> {clue}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => setShowErrors(!showErrors)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            {showErrors ? 'Verberg' : 'Toon'} Fouten
          </button>
          <button
            onClick={() => {
              setUserGrid(Array(size).fill(null).map(() => Array(size).fill('')))
              setIsComplete(false)
              setHintsUsed(0)
            }}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-1" />
            Opnieuw
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p><strong>Tip:</strong> Spatiebalk wisselt tussen horizontaal en verticaal</p>
        </div>
      </div>

      {/* Completion Modal */}
      {isComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md">
            <div className="text-center">
              <Trophy className="w-16 h-16 mx-auto text-brand-yellow mb-4" />
              <h2 className="text-2xl font-bold text-brand-blue mb-2">Gefeliciteerd!</h2>
              <p className="text-gray-600 mb-4">
                Je hebt de puzzel opgelost in {formatTime(elapsedTime)}
              </p>
              <div className="bg-brand-yellow bg-opacity-20 rounded p-4 mb-4">
                <p className="text-3xl font-bold text-brand-blue">{calculateScore()} punten</p>
                {hintsUsed > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    ({hintsUsed} hint{hintsUsed > 1 ? 's' : ''} gebruikt)
                  </p>
                )}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-brand-blue text-white rounded hover:opacity-90"
              >
                Nieuwe Puzzel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}