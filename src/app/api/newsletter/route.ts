import { NextRequest, NextResponse } from 'next/server'

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'E-mailadres is verplicht' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Voer een geldig e-mailadres in' },
        { status: 400 }
      )
    }

    // Here you would integrate with your email service provider
    // Examples: Mailchimp, Klaviyo, SendGrid, etc.
    
    // For now, we'll simulate a successful subscription
    // Replace this with your actual email service integration
    
    /*
    // Example Mailchimp integration:
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID
    const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX

    const response = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          tags: ['website-footer']
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      if (errorData.title === 'Member Exists') {
        return NextResponse.json(
          { success: false, error: 'Dit e-mailadres is al aangemeld' },
          { status: 400 }
        )
      }
      throw new Error('Failed to subscribe to newsletter')
    }
    */

    // Simulate successful subscription
    console.log(`Newsletter subscription: ${email}`)
    
    // TODO: Replace with actual email service integration
    // You can integrate with services like:
    // - Mailchimp
    // - Klaviyo  
    // - SendGrid
    // - ConvertKit
    // - Your own database + email service

    return NextResponse.json(
      { 
        success: true, 
        message: 'Bedankt voor uw aanmelding! U ontvangt binnenkort een bevestiging.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, error: 'Er is iets misgegaan. Probeer het later opnieuw.' },
      { status: 500 }
    )
  }
}

// GET - Get newsletter info (optional)
export async function GET() {
  return NextResponse.json({
    message: 'Newsletter API endpoint',
    available_methods: ['POST'],
    description: 'Subscribe to the Barnevelds Dagblad newsletter'
  })
}