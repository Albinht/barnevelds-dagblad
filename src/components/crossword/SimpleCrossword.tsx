'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

interface CellData {
  letter: string
  number?: number
  isBlack: boolean
  row: number
  col: number
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

// Demo puzzle data
const demoPuzzleData = {
  grid: [
    ['K', 'I', 'P', '#', 'B', 'O', 'O', 'M', 'S'],
    ['A', 'A', 'P', '#', 'A', 'U', 'T', 'O', 'S'],
    ['T', 'A', 'S', '#', 'R', 'A', 'A', 'M', 'S'],
    ['#', '#', '#', 'D', 'A', 'S', '#', '#', '#'],
    ['H', 'U', 'I', 'S', 'V', 'E', 'L', 'D', 'E'],
    ['#', '#', '#', 'J', 'E', 'T', '#', '#', '#'],
    ['B', 'R', 'O', 'O', 'D', '#', 'W', 'E', 'G'],
    ['L', 'O', 'O', 'N', 'S', '#', 'I', 'I', 'S'],
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

export default function SimpleCrossword({ size = 9, puzzle = demoPuzzleData }: CrosswordProps) {
  const [grid, setGrid] = useState<CellData[][]>([])
  const [userGrid, setUserGrid] = useState<string[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [direction, setDirection] = useState<'across' | 'down'>('across')
  const [isComplete, setIsComplete] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Initialize grid
  useEffect(() => {
    const newGrid: CellData[][] = []
    const newUserGrid: string[][] = []

    for (let row = 0; row < size; row++) {
      const gridRow: CellData[] = []
      const userRow: string[] = []

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
      }
      newGrid.push(gridRow)
      newUserGrid.push(userRow)
    }

    setGrid(newGrid)
    setUserGrid(newUserGrid)
  }, [size, puzzle])

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number) => {
    if (grid[row]?.[col]?.isBlack) return

    // If clicking the same cell, toggle direction
    if (selectedCell?.row === row && selectedCell?.col === col) {
      setDirection(d => d === 'across' ? 'down' : 'across')
    } else {
      setSelectedCell({ row, col })
      // Keep the current direction when selecting a new cell
    }
  }, [grid, selectedCell])

  // Handle keyboard input
  const handleKeyPress = useCallback((e: React.KeyboardEvent, row: number, col: number) => {
    e.preventDefault()

    if (grid[row]?.[col]?.isBlack) return

    const key = e.key.toUpperCase()

    // Letter input
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      const newUserGrid = [...userGrid]
      newUserGrid[row][col] = key
      setUserGrid(newUserGrid)

      // Move to next cell based on current direction
      if (direction === 'across') {
        let newCol = col + 1
        while (newCol < size && grid[row][newCol]?.isBlack) newCol++
        if (newCol < size) {
          setSelectedCell({ row, col: newCol })
        }
      } else {
        let newRow = row + 1
        while (newRow < size && grid[newRow]?.[col]?.isBlack) newRow++
        if (newRow < size) {
          setSelectedCell({ row: newRow, col })
        }
      }

      // Check if puzzle is complete
      checkCompletion(newUserGrid)
    }
    // Backspace
    else if (e.key === 'Backspace') {
      const newUserGrid = [...userGrid]
      newUserGrid[row][col] = ''
      setUserGrid(newUserGrid)

      // Move to previous cell
      moveToPreviousCell(row, col)
    }
    // Arrow keys
    else if (e.key === 'ArrowUp' && row > 0) {
      let newRow = row - 1
      while (newRow >= 0 && grid[newRow][col].isBlack) newRow--
      if (newRow >= 0) {
        setSelectedCell({ row: newRow, col })
        setDirection('down')
      }
    }
    else if (e.key === 'ArrowDown' && row < size - 1) {
      let newRow = row + 1
      while (newRow < size && grid[newRow][col].isBlack) newRow++
      if (newRow < size) {
        setSelectedCell({ row: newRow, col })
        setDirection('down')
      }
    }
    else if (e.key === 'ArrowLeft' && col > 0) {
      let newCol = col - 1
      while (newCol >= 0 && grid[row][newCol].isBlack) newCol--
      if (newCol >= 0) {
        setSelectedCell({ row, col: newCol })
        setDirection('across')
      }
    }
    else if (e.key === 'ArrowRight' && col < size - 1) {
      let newCol = col + 1
      while (newCol < size && grid[row][newCol].isBlack) newCol++
      if (newCol < size) {
        setSelectedCell({ row, col: newCol })
        setDirection('across')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, userGrid, direction, size])

  // Removed unused moveToNextCell function - logic is inline in handleKeyPress

  // Move to previous cell
  const moveToPreviousCell = (row: number, col: number) => {
    if (direction === 'across') {
      let newCol = col - 1
      while (newCol >= 0 && grid[row][newCol]?.isBlack) newCol--
      if (newCol >= 0) {
        setSelectedCell({ row, col: newCol })
      }
    } else {
      let newRow = row - 1
      while (newRow >= 0 && grid[newRow]?.[col]?.isBlack) newRow--
      if (newRow >= 0) {
        setSelectedCell({ row: newRow, col })
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

    if (complete && !isComplete) {
      setIsComplete(true)
      setTimeout(() => {
        alert('Gefeliciteerd! Je hebt de puzzel opgelost!')
      }, 100)
    }
  }

  // Reset puzzle
  const resetPuzzle = () => {
    const newUserGrid = Array(size).fill(null).map(() => Array(size).fill(''))
    setUserGrid(newUserGrid)
    setIsComplete(false)
    setShowSolution(false)
    setSelectedCell(null)
  }

  // Get highlighted cells for current word
  const getHighlightedCells = () => {
    const highlighted = new Set<string>()
    if (!selectedCell) return highlighted

    const { row, col } = selectedCell

    if (direction === 'across') {
      // Find start of word
      let startCol = col
      while (startCol > 0 && !grid[row][startCol - 1].isBlack) startCol--

      // Highlight entire word
      let currentCol = startCol
      while (currentCol < size && !grid[row][currentCol].isBlack) {
        highlighted.add(`${row}-${currentCol}`)
        currentCol++
      }
    } else {
      // Find start of word
      let startRow = row
      while (startRow > 0 && !grid[startRow - 1][col].isBlack) startRow--

      // Highlight entire word
      let currentRow = startRow
      while (currentRow < size && !grid[currentRow][col].isBlack) {
        highlighted.add(`${currentRow}-${col}`)
        currentRow++
      }
    }

    return highlighted
  }

  const highlightedCells = getHighlightedCells()

  // Get current clue
  const getCurrentClue = () => {
    if (!selectedCell) return ''

    const { row, col } = selectedCell
    let clueNumber = null

    if (direction === 'across') {
      // Find start of across word
      let startCol = col
      while (startCol > 0 && !grid[row][startCol - 1].isBlack) startCol--
      clueNumber = grid[row][startCol].number

      // Look for clue
      if (clueNumber && puzzle.clues.across[clueNumber]) {
        return `${clueNumber} Horizontaal: ${puzzle.clues.across[clueNumber]}`
      }
    } else {
      // Find start of down word
      let startRow = row
      while (startRow > 0 && !grid[startRow - 1][col].isBlack) startRow--
      clueNumber = grid[startRow][col].number

      // Look for clue
      if (clueNumber && puzzle.clues.down[clueNumber]) {
        return `${clueNumber} Verticaal: ${puzzle.clues.down[clueNumber]}`
      }
    }

    return ''
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Controls */}
      <div className="mb-4 flex gap-4 justify-center items-center">
        <button
          onClick={() => setDirection(d => d === 'across' ? 'down' : 'across')}
          className={`px-4 py-2 rounded font-semibold ${
            direction === 'across'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          → Horizontaal
        </button>
        <button
          onClick={() => setDirection(d => d === 'across' ? 'down' : 'across')}
          className={`px-4 py-2 rounded font-semibold ${
            direction === 'down'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ↓ Verticaal
        </button>
        <div className="w-px h-8 bg-gray-400 mx-2"></div>
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showSolution ? 'Verberg oplossing' : 'Toon oplossing'}
        </button>
        <button
          onClick={resetPuzzle}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Opnieuw beginnen
        </button>
      </div>

      {/* Current clue */}
      {selectedCell && (
        <div className="mb-4 p-3 bg-yellow-50 rounded text-center">
          <p className="font-semibold">{getCurrentClue()}</p>
        </div>
      )}

      {/* Grid */}
      <div className="flex gap-8">
        <div
          ref={gridRef}
          className="inline-block border-2 border-gray-800 bg-gray-800"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${size}, 40px)`,
            gridTemplateRows: `repeat(${size}, 40px)`,
            gap: '1px'
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
              const isHighlighted = highlightedCells.has(`${rowIndex}-${colIndex}`)
              const cellValue = showSolution ? puzzle.grid[rowIndex][colIndex] : userGrid[rowIndex]?.[colIndex] || ''
              const isCorrect = userGrid[rowIndex]?.[colIndex] === puzzle.grid[rowIndex][colIndex]

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    relative w-10 h-10 border border-gray-300 cursor-pointer transition-colors
                    ${cell.isBlack ? 'bg-gray-900' : 'bg-white'}
                    ${isSelected ? 'bg-blue-300 ring-2 ring-blue-500' : ''}
                    ${isHighlighted && !isSelected ? 'bg-yellow-100' : ''}
                    ${showSolution && !cell.isBlack && !isCorrect && userGrid[rowIndex]?.[colIndex] ? 'text-red-600' : ''}
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onKeyDown={(e) => handleKeyPress(e, rowIndex, colIndex)}
                  tabIndex={cell.isBlack ? -1 : 0}
                >
                  {!cell.isBlack && (
                    <>
                      {cell.number && (
                        <span className="absolute top-0 left-0.5 text-xs font-bold">
                          {cell.number}
                        </span>
                      )}
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                        {cellValue !== '#' ? cellValue : ''}
                      </div>
                    </>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Clues */}
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Horizontaal</h3>
            <div className="space-y-1 text-sm">
              {Object.entries(puzzle.clues.across).map(([num, clue]) => {
                const clueNum = parseInt(num)
                const isActive = direction === 'across' && highlightedCells.size > 0 &&
                  Array.from(highlightedCells).some(cellKey => {
                    const [r, c] = cellKey.split('-').map(Number)
                    return grid[r][c].number === clueNum
                  })

                return (
                  <div
                    key={num}
                    className={`p-1 rounded cursor-pointer transition-colors ${
                      isActive ? 'bg-yellow-200 font-semibold' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      // Find the starting cell of this across clue
                      for (let r = 0; r < size; r++) {
                        for (let c = 0; c < size; c++) {
                          if (grid[r][c].number === clueNum && !grid[r][c].isBlack) {
                            // Check if this is the start of an across word
                            if (c === 0 || grid[r][c-1]?.isBlack) {
                              setSelectedCell({ row: r, col: c })
                              setDirection('across')
                              return
                            }
                          }
                        }
                      }
                    }}
                  >
                    <span className="font-semibold">{num}.</span> {clue}
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Verticaal</h3>
            <div className="space-y-1 text-sm">
              {Object.entries(puzzle.clues.down).map(([num, clue]) => {
                const clueNum = parseInt(num)
                const isActive = direction === 'down' && highlightedCells.size > 0 &&
                  Array.from(highlightedCells).some(cellKey => {
                    const [r, c] = cellKey.split('-').map(Number)
                    return grid[r][c].number === clueNum
                  })

                return (
                  <div
                    key={num}
                    className={`p-1 rounded cursor-pointer transition-colors ${
                      isActive ? 'bg-yellow-200 font-semibold' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      // Find the starting cell of this down clue
                      for (let r = 0; r < size; r++) {
                        for (let c = 0; c < size; c++) {
                          if (grid[r][c].number === clueNum && !grid[r][c].isBlack) {
                            // Check if this is the start of a down word
                            if (r === 0 || grid[r-1]?.[c]?.isBlack) {
                              setSelectedCell({ row: r, col: c })
                              setDirection('down')
                              return
                            }
                          }
                        }
                      }
                    }}
                  >
                    <span className="font-semibold">{num}.</span> {clue}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {isComplete && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded text-center font-bold">
          Gefeliciteerd! Puzzel opgelost! 🎉
        </div>
      )}
    </div>
  )
}