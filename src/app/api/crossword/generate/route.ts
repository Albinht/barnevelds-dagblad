import { NextRequest, NextResponse } from 'next/server'
import { getGenerator } from '@/lib/crossword/generator'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Only allow admins to generate new puzzles
    if (!session?.user?.email || session.user.email !== 'admin@barneveldsdagblad.nl') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { difficulty = 'medium' } = body

    // Generate new puzzle
    const generator = getGenerator({ difficulty })
    const generatedPuzzle = await generator.generate()

    // Save to database
    const puzzle = await prisma.crosswordPuzzle.create({
      data: {
        title: generatedPuzzle.title,
        difficulty,
        gridSize: generatedPuzzle.gridSize,
        grid: generatedPuzzle.grid,
        clues: generatedPuzzle.clues,
        solution: generatedPuzzle.solution
      }
    })

    return NextResponse.json({
      success: true,
      puzzle: {
        id: puzzle.id,
        title: puzzle.title,
        difficulty: puzzle.difficulty,
        gridSize: puzzle.gridSize,
        createdAt: puzzle.createdAt
      }
    })
  } catch (error) {
    console.error('Error generating crossword:', error)
    return NextResponse.json(
      { error: 'Failed to generate crossword' },
      { status: 500 }
    )
  }
}