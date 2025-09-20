import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Get user ID if logged in, otherwise use anonymous tracking
    const userId = session?.user?.id || 'anonymous'

    const body = await request.json()
    const { puzzleId, score, completionTime, hintsUsed = 0 } = body

    // Validate puzzle exists
    const puzzle = await prisma.crosswordPuzzle.findUnique({
      where: { id: puzzleId }
    })

    if (!puzzle) {
      return NextResponse.json(
        { error: 'Puzzle not found' },
        { status: 404 }
      )
    }

    // Save completion
    const completion = await prisma.crosswordCompletion.create({
      data: {
        puzzleId,
        userId,
        completionTime,
        score,
        hintsUsed
      }
    })

    // Get statistics
    const stats = await prisma.crosswordCompletion.aggregate({
      where: { puzzleId },
      _avg: {
        score: true,
        completionTime: true
      },
      _min: {
        completionTime: true
      },
      _max: {
        score: true
      },
      _count: true
    })

    return NextResponse.json({
      success: true,
      completion: {
        id: completion.id,
        score: completion.score,
        completionTime: completion.completionTime,
        rank: await calculateRank(puzzleId, score)
      },
      stats: {
        totalCompletions: stats._count,
        averageScore: Math.round(stats._avg.score || 0),
        averageTime: Math.round(stats._avg.completionTime || 0),
        bestTime: stats._min.completionTime || 0,
        bestScore: stats._max.score || 0
      }
    })
  } catch (error) {
    console.error('Error saving completion:', error)
    return NextResponse.json(
      { error: 'Failed to save completion' },
      { status: 500 }
    )
  }
}

async function calculateRank(puzzleId: string, score: number): Promise<number> {
  const betterScores = await prisma.crosswordCompletion.count({
    where: {
      puzzleId,
      score: {
        gt: score
      }
    }
  })

  return betterScores + 1
}