import { NextRequest, NextResponse } from 'next/server'
import { getGenerator } from '@/lib/crossword/generator'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { Prisma } from '@prisma/client'

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
        gridData: generatedPuzzle.grid as unknown as Prisma.InputJsonValue,
        cluesAcross: generatedPuzzle.clues.across as unknown as Prisma.InputJsonValue,
        cluesDown: generatedPuzzle.clues.down as unknown as Prisma.InputJsonValue,
        solution: generatedPuzzle.solution as unknown as Prisma.InputJsonValue,
        publishDate: new Date()
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