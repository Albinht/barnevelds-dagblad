'use client'

import React, { useState, useRef } from 'react'
import { Cell } from '@/lib/crossword/types'

interface CrosswordGridProps {
  cells: Cell[][]
  size: number
  onCellChange?: (x: number, y: number, value: string) => void
  onCellSelect?: (x: number, y: number) => void
  selectedCell?: { x: number; y: number } | null
  highlightedWord?: number | null
  direction?: 'across' | 'down'
  readOnly?: boolean
  showSolution?: boolean
  solution?: string[][]
}

export default function CrosswordGrid({
  cells,
  size,
  onCellChange,
  onCellSelect,
  selectedCell,
  highlightedWord,
  direction = 'across',
  readOnly = false,
  showSolution = false,
  solution
}: CrosswordGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [userInput, setUserInput] = useState<{ [key: string]: string }>({})

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, x: number, y: number) => {
    if (readOnly) return

    const key = e.key

    // Navigation with arrow keys
    if (key === 'ArrowUp' && y > 0) {
      e.preventDefault()
      selectNextCell(x, y - 1, 'up')
    } else if (key === 'ArrowDown' && y < size - 1) {
      e.preventDefault()
      selectNextCell(x, y + 1, 'down')
    } else if (key === 'ArrowLeft' && x > 0) {
      e.preventDefault()
      selectNextCell(x - 1, y, 'left')
    } else if (key === 'ArrowRight' && x < size - 1) {
      e.preventDefault()
      selectNextCell(x + 1, y, 'right')
    } else if (key === 'Backspace' || key === 'Delete') {
      e.preventDefault()
      handleCellInput(x, y, '')
      // Move to previous cell on backspace
      if (key === 'Backspace') {
        if (direction === 'across' && x > 0) {
          selectNextCell(x - 1, y, 'left')
        } else if (direction === 'down' && y > 0) {
          selectNextCell(x, y - 1, 'up')
        }
      }
    } else if (key === 'Tab') {
      e.preventDefault()
      // Find next word
      moveToNextWord(x, y, e.shiftKey)
    } else if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
      e.preventDefault()
      handleCellInput(x, y, key.toUpperCase())
      // Move to next cell after input
      if (direction === 'across' && x < size - 1) {
        selectNextCell(x + 1, y, 'right')
      } else if (direction === 'down' && y < size - 1) {
        selectNextCell(x, y + 1, 'down')
      }
    }
  }

  const selectNextCell = (x: number, y: number, moveDirection: string) => {
    // Skip black cells
    while (cells[y] && cells[y][x] && cells[y][x].isBlack) {
      if (moveDirection === 'up' && y > 0) y--
      else if (moveDirection === 'down' && y < size - 1) y++
      else if (moveDirection === 'left' && x > 0) x--
      else if (moveDirection === 'right' && x < size - 1) x++
      else break
    }

    if (cells[y] && cells[y][x] && !cells[y][x].isBlack) {
      onCellSelect?.(x, y)
    }
  }

  const moveToNextWord = (currentX: number, currentY: number) => {
    // Simplified: just move to next numbered cell
    let found = false
    const startY = currentY
    const startX = currentX + 1

    for (let y = startY; y < size && !found; y++) {
      for (let x = (y === startY ? startX : 0); x < size && !found; x++) {
        if (cells[y][x].number && !cells[y][x].isBlack) {
          onCellSelect?.(x, y)
          found = true
        }
      }
    }

    // If not found, wrap to beginning
    if (!found) {
      for (let y = 0; y <= currentY && !found; y++) {
        for (let x = 0; x < (y === currentY ? currentX : size) && !found; x++) {
          if (cells[y][x].number && !cells[y][x].isBlack) {
            onCellSelect?.(x, y)
            found = true
          }
        }
      }
    }
  }

  const handleCellInput = (x: number, y: number, value: string) => {
    const key = `${x}-${y}`
    setUserInput(prev => ({ ...prev, [key]: value }))
    onCellChange?.(x, y, value)
  }

  const handleCellClick = (x: number, y: number) => {
    if (cells[y][x].isBlack) return
    onCellSelect?.(x, y)
  }

  const getCellValue = (x: number, y: number): string => {
    if (showSolution && solution) {
      return solution[y][x] === '#' ? '' : solution[y][x]
    }
    const key = `${x}-${y}`
    return userInput[key] || cells[y][x].value || ''
  }

  const getCellClassName = (cell: Cell): string => {
    const classes = ['relative border border-gray-300 bg-white']

    if (cell.isBlack) {
      classes.push('bg-gray-900')
    } else {
      // Selected cell
      if (selectedCell?.x === cell.x && selectedCell?.y === cell.y) {
        classes.push('bg-blue-200')
      }
      // Highlighted word
      else if (
        (direction === 'across' && cell.partOfAcross === highlightedWord) ||
        (direction === 'down' && cell.partOfDown === highlightedWord)
      ) {
        classes.push('bg-yellow-100')
      }

      // Check if correct (only in solution mode)
      if (showSolution && solution) {
        const value = getCellValue(cell.x, cell.y)
        const correct = solution[cell.y][cell.x]
        if (value && value !== correct && correct !== '#') {
          classes.push('text-red-600')
        } else if (value === correct) {
          classes.push('text-green-600')
        }
      }
    }

    return classes.join(' ')
  }

  // Cell size calculation removed - was unused

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        ref={gridRef}
        className="grid bg-gray-200 gap-0 border-2 border-gray-800"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          aspectRatio: '1'
        }}
      >
        {cells.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={getCellClassName(cell)}
              onClick={() => handleCellClick(x, y)}
              style={{ aspectRatio: '1' }}
            >
              {!cell.isBlack && (
                <>
                  {/* Cell number */}
                  {cell.number && (
                    <span className="absolute top-0 left-0.5 text-xs font-bold">
                      {cell.number}
                    </span>
                  )}

                  {/* Cell input */}
                  <input
                    type="text"
                    value={getCellValue(x, y)}
                    onChange={(e) => handleCellInput(x, y, e.target.value.toUpperCase())}
                    onKeyDown={(e) => handleKeyDown(e, x, y)}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCellClick(x, y)
                    }}
                    className="w-full h-full text-center text-lg font-bold bg-transparent outline-none cursor-pointer"
                    maxLength={1}
                    readOnly={readOnly || showSolution}
                    style={{
                      caretColor: 'transparent',
                      paddingTop: cell.number ? '16px' : '0'
                    }}
                  />
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}