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
        timeSpent: completionTime,
        progress: { score },
        completed: true,
        completedAt: new Date(),
        hintsUsed
      }
    })

    // Get statistics
    const stats = await prisma.crosswordCompletion.aggregate({
      where: { puzzleId },
      _avg: {
        timeSpent: true
      },
      _min: {
        timeSpent: true
      },
      _count: true
    })

    return NextResponse.json({
      success: true,
      completion: {
        id: completion.id,
        score,
        timeSpent: completion.timeSpent,
        rank: await calculateRank(puzzleId, score)
      },
      stats: {
        totalCompletions: stats._count,
        averageTime: Math.round(stats._avg.timeSpent || 0),
        bestTime: stats._min.timeSpent || 0
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
  // For now, return a basic rank - could be improved to check JSON progress field
  const allCompletions = await prisma.crosswordCompletion.findMany({
    where: { puzzleId, completed: true }
  })

  let betterScores = 0
  for (const completion of allCompletions) {
    const compScore = (completion.progress as any)?.score || 0
    if (compScore > score) betterScores++
  }

  return betterScores + 1
}