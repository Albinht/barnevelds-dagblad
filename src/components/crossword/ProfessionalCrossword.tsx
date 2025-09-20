'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

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
  size?: number
  puzzle?: {
    grid: string[][]
    numbers: (number | null)[][]
    clues: {
      across: { [key: number]: string }
      down: { [key: number]: string }
    }
  }
}

// Demo puzzle - same as before but with better structure
const demoPuzzleData = {
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
}

export default function ProfessionalCrossword({ size = 9, puzzle = demoPuzzleData }: CrosswordProps) {
  const [grid, setGrid] = useState<CellData[][]>([])
  const [userGrid, setUserGrid] = useState<string[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [direction, setDirection] = useState<'across' | 'down'>('across')
  const [isComplete, setIsComplete] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [score, setScore] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([])

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

    // Find which cells belong to which words
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!newGrid[row][col].isBlack) {
          // Check for across word
          if ((col === 0 || newGrid[row][col-1]?.isBlack) && col < size - 1 && !newGrid[row][col+1]?.isBlack) {
            const num = newGrid[row][col].number
            let c = col
            while (c < size && !newGrid[row][c]?.isBlack) {
              newGrid[row][c].partOfAcross = num
              c++
            }
          }

          // Check for down word
          if ((row === 0 || newGrid[row-1]?.[col]?.isBlack) && row < size - 1 && !newGrid[row+1]?.[col]?.isBlack) {
            const num = newGrid[row][col].number
            let r = row
            while (r < size && !newGrid[r]?.[col]?.isBlack) {
              newGrid[r][col].partOfDown = num
              r++
            }
          }
        }
      }
    }

    setGrid(newGrid)
    setUserGrid(newUserGrid)
    inputRefs.current = refs
  }, [size, puzzle])

  // Calculate score
  useEffect(() => {
    let correct = 0
    let total = 0
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!grid[row]?.[col]?.isBlack && userGrid[row]?.[col]) {
          total++
          if (userGrid[row][col] === puzzle.grid[row][col]) {
            correct++
          }
        }
      }
    }
    setScore(Math.round((correct / Math.max(total, 1)) * 100))
  }, [userGrid, grid, puzzle, size])

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number, shouldToggle: boolean = true) => {
    if (grid[row]?.[col]?.isBlack) return

    // If clicking the same cell, toggle direction (but only if shouldToggle is true)
    if (selectedCell?.row === row && selectedCell?.col === col && shouldToggle) {
      setDirection(d => d === 'across' ? 'down' : 'across')
    } else {
      setSelectedCell({ row, col })
    }

    // Focus the input
    inputRefs.current[row]?.[col]?.focus()
  }, [grid, selectedCell])

  // Handle input
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const value = e.target.value.toUpperCase()
    if (value.length > 1) return // Prevent multiple characters

    const newUserGrid = [...userGrid]
    newUserGrid[row][col] = value
    setUserGrid(newUserGrid)

    // Auto-advance to next cell if a letter was entered
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

    // Check completion
    checkCompletion(newUserGrid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userGrid, direction, grid, size])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent, row: number, col: number) => {
    // Space bar toggles direction
    if (e.key === ' ') {
      e.preventDefault()
      setDirection(d => d === 'across' ? 'down' : 'across')
      return
    }

    // Tab moves to next word
    if (e.key === 'Tab') {
      e.preventDefault()
      moveToNextWord(e.shiftKey)
      return
    }

    // Arrow keys navigate
    if (e.key === 'ArrowLeft' && col > 0) {
      e.preventDefault()
      moveToPreviousCell(row, col)
    } else if (e.key === 'ArrowRight' && col < size - 1) {
      e.preventDefault()
      let newCol = col + 1
      while (newCol < size && grid[row][newCol]?.isBlack) newCol++
      if (newCol < size) {
        setSelectedCell({ row, col: newCol })
        inputRefs.current[row]?.[newCol]?.focus()
      }
    } else if (e.key === 'ArrowUp' && row > 0) {
      e.preventDefault()
      let newRow = row - 1
      while (newRow >= 0 && grid[newRow][col].isBlack) newRow--
      if (newRow >= 0) {
        setSelectedCell({ row: newRow, col })
        inputRefs.current[newRow]?.[col]?.focus()
      }
    } else if (e.key === 'ArrowDown' && row < size - 1) {
      e.preventDefault()
      let newRow = row + 1
      while (newRow < size && grid[newRow][col].isBlack) newRow++
      if (newRow < size) {
        setSelectedCell({ row: newRow, col })
        inputRefs.current[newRow]?.[col]?.focus()
      }
    }
    // Backspace
    else if (e.key === 'Backspace' && !userGrid[row][col]) {
      e.preventDefault()
      moveToPreviousCell(row, col)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, userGrid, direction, size])


  // Move to previous cell in current direction
  const moveToPreviousCell = (row: number, col: number) => {
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

  // Move to next word
  const moveToNextWord = (reverse: boolean = false) => {
    const words = direction === 'across' ? puzzle.clues.across : puzzle.clues.down
    const wordNumbers = Object.keys(words).map(Number).sort((a, b) => reverse ? b - a : a - b)

    let currentWordNum = 0
    if (selectedCell) {
      currentWordNum = direction === 'across'
        ? grid[selectedCell.row][selectedCell.col].partOfAcross || 0
        : grid[selectedCell.row][selectedCell.col].partOfDown || 0
    }

    const currentIndex = wordNumbers.indexOf(currentWordNum)
    const nextIndex = (currentIndex + 1) % wordNumbers.length
    const nextWordNum = wordNumbers[nextIndex]

    // Find the start cell of the next word
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col].number === nextWordNum) {
          setSelectedCell({ row, col })
          inputRefs.current[row]?.[col]?.focus()
          return
        }
      }
    }
  }

  // Check if puzzle is complete
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
    setIsComplete(complete)
  }

  // Solve functions
  const solveLetter = () => {
    if (!selectedCell) return
    const { row, col } = selectedCell
    const newUserGrid = [...userGrid]
    newUserGrid[row][col] = puzzle.grid[row][col]
    setUserGrid(newUserGrid)

    // Move to next cell in current direction
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

  const solveWord = () => {
    if (!selectedCell) return
    const { row, col } = selectedCell
    const newUserGrid = [...userGrid]

    if (direction === 'across') {
      const wordNum = grid[row][col].partOfAcross
      for (let c = 0; c < size; c++) {
        if (grid[row][c].partOfAcross === wordNum) {
          newUserGrid[row][c] = puzzle.grid[row][c]
        }
      }
    } else {
      const wordNum = grid[row][col].partOfDown
      for (let r = 0; r < size; r++) {
        if (grid[r][col].partOfDown === wordNum) {
          newUserGrid[r][col] = puzzle.grid[r][col]
        }
      }
    }

    setUserGrid(newUserGrid)
  }

  const solvePuzzle = () => {
    const newUserGrid = puzzle.grid.map(row => [...row])
    setUserGrid(newUserGrid)
    setIsComplete(true)
  }

  const resetPuzzle = () => {
    const newUserGrid = Array(size).fill(null).map(() => Array(size).fill(''))
    setUserGrid(newUserGrid)
    setIsComplete(false)
    setShowErrors(false)
    setSelectedCell(null)
  }

  // Get highlighted cells for current word
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
    let clueNumber = null

    if (direction === 'across') {
      clueNumber = grid[row][col].partOfAcross
      if (clueNumber && puzzle.clues.across[clueNumber]) {
        return { number: clueNumber, text: puzzle.clues.across[clueNumber], direction: 'Horizontaal' }
      }
    } else {
      clueNumber = grid[row][col].partOfDown
      if (clueNumber && puzzle.clues.down[clueNumber]) {
        return { number: clueNumber, text: puzzle.clues.down[clueNumber], direction: 'Verticaal' }
      }
    }

    return null
  }

  const currentClue = getCurrentClue()

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-4 bg-gray-100 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Kruiswoordpuzzel #{Math.floor(Math.random() * 10000) + 1000}</h2>
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">Score: {score}%</span>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Volgende Puzzel
            </button>
          </div>
        </div>

        {/* Current clue display */}
        {currentClue && (
          <div className="bg-yellow-100 p-3 rounded mt-2">
            <span className="font-bold">{currentClue.number} {currentClue.direction}:</span> {currentClue.text}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Crossword Grid */}
        <div className="lg:col-span-2">
          <div
            className="inline-block border-2 border-gray-800 bg-gray-800"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${size}, 45px)`,
              gridTemplateRows: `repeat(${size}, 45px)`,
              gap: '1px'
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
                      relative w-[45px] h-[45px]
                      ${cell.isBlack ? 'bg-gray-900' : 'bg-white'}
                      ${isHighlighted && !isSelected ? 'bg-yellow-100' : ''}
                      ${isSelected ? 'bg-blue-200' : ''}
                    `}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {!cell.isBlack && (
                      <>
                        {cell.number && (
                          <span className="absolute top-0 left-1 text-xs font-bold">
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
                            outline-none cursor-pointer pt-2
                            ${hasError ? 'text-red-600' : ''}
                          `}
                          maxLength={1}
                          autoComplete="off"
                        />
                      </>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Control buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={solveLetter}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Los Letter Op
            </button>
            <button
              onClick={solveWord}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Los Woord Op
            </button>
            <button
              onClick={solvePuzzle}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Los Puzzel Op
            </button>
            <button
              onClick={() => setShowErrors(!showErrors)}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              {showErrors ? 'Verberg' : 'Toon'} Fouten
            </button>
            <button
              onClick={resetPuzzle}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Reset
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Tip:</strong> Spatiebalk wisselt tussen Horizontaal en Verticaal. Tab gaat naar het volgende woord.</p>
          </div>
        </div>

        {/* Clues */}
        <div className="space-y-6">
          {/* Across */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-orange-600">Horizontaal</h3>
            <div className="space-y-1">
              {Object.entries(puzzle.clues.across).map(([num, clue]) => {
                const clueNum = parseInt(num)
                const isActive = direction === 'across' && selectedCell &&
                  grid[selectedCell.row][selectedCell.col].partOfAcross === clueNum

                return (
                  <div
                    key={num}
                    className={`
                      p-2 rounded cursor-pointer text-sm transition-colors
                      ${isActive ? 'bg-yellow-200 font-semibold' : 'hover:bg-gray-100'}
                    `}
                    onClick={() => {
                      // Find and select the first cell of this clue
                      for (let r = 0; r < size; r++) {
                        for (let c = 0; c < size; c++) {
                          if (grid[r][c].number === clueNum) {
                            setSelectedCell({ row: r, col: c })
                            setDirection('across')
                            inputRefs.current[r]?.[c]?.focus()
                            return
                          }
                        }
                      }
                    }}
                  >
                    <span className="font-bold">{num}.</span> {clue}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Down */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-orange-600">Verticaal</h3>
            <div className="space-y-1">
              {Object.entries(puzzle.clues.down).map(([num, clue]) => {
                const clueNum = parseInt(num)
                const isActive = direction === 'down' && selectedCell &&
                  grid[selectedCell.row][selectedCell.col].partOfDown === clueNum

                return (
                  <div
                    key={num}
                    className={`
                      p-2 rounded cursor-pointer text-sm transition-colors
                      ${isActive ? 'bg-yellow-200 font-semibold' : 'hover:bg-gray-100'}
                    `}
                    onClick={() => {
                      // Find and select the first cell of this clue
                      for (let r = 0; r < size; r++) {
                        for (let c = 0; c < size; c++) {
                          if (grid[r][c].number === clueNum) {
                            setSelectedCell({ row: r, col: c })
                            setDirection('down')
                            inputRefs.current[r]?.[c]?.focus()
                            return
                          }
                        }
                      }
                    }}
                  >
                    <span className="font-bold">{num}.</span> {clue}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Completion message */}
      {isComplete && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg text-center font-bold text-xl">
          Gefeliciteerd! Puzzel opgelost! 🎉
        </div>
      )}
    </div>
  )
}