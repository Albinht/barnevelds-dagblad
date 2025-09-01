import { getCurrentSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getCurrentSession()
    
    if (!session) {
      return Response.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    return Response.json({ 
      authenticated: true, 
      user: session 
    })
    
  } catch (error) {
    return Response.json(
      { error: 'Session check failed' },
      { status: 500 }
    )
  }
}