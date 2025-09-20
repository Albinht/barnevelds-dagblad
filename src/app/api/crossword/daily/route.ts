import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getGenerator } from '@/lib/crossword/generator'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const difficulty = (searchParams.get('difficulty') || 'easy') as 'easy' | 'medium' | 'hard'

    // Get today's date (normalized to midnight)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Check if we already have a puzzle for today
    let puzzle = await prisma.crosswordPuzzle.findFirst({
      where: {
        difficulty,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // If no puzzle exists for today, generate a new one
    if (!puzzle) {
      const generator = getGenerator({ difficulty })
      const generatedPuzzle = await generator.generate()

      puzzle = await prisma.crosswordPuzzle.create({
        data: {
          title: generatedPuzzle.title,
          difficulty,
          gridSize: generatedPuzzle.gridSize,
          grid: generatedPuzzle.grid,
          clues: generatedPuzzle.clues,
          solution: generatedPuzzle.solution
        }
      })
    }

    return NextResponse.json({
      id: puzzle.id,
      title: puzzle.title,
      difficulty: puzzle.difficulty,
      gridSize: puzzle.gridSize,
      grid: puzzle.grid,
      clues: puzzle.clues,
      // Don't send solution to client initially
      createdAt: puzzle.createdAt
    })
  } catch (error) {
    console.error('Error fetching daily crossword:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily crossword' },
      { status: 500 }
    )
  }
}