import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, EMAIL_CONFIG } from '@/lib/email'
import { getNewsletterEmailTemplates } from '@/lib/email-templates'

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, frequency, categories } = body

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

    // Genereer email template
    const { confirmationEmail } = getNewsletterEmailTemplates({
      email,
      frequency: frequency || 'daily',
      categories: categories || {}
    })

    // Stuur bevestigingsmail
    const result = await sendEmail({
      to: email,
      subject: confirmationEmail.subject,
      html: confirmationEmail.html
    })

    if (!result.success) {
      console.error('Failed to send confirmation email:', result.error)
    }

    // Stuur ook een notificatie naar admin
    await sendEmail({
      to: EMAIL_CONFIG.adminEmail,
      subject: 'Nieuwe nieuwsbrief aanmelding',
      html: `
        <h2>Nieuwe nieuwsbrief aanmelding</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Frequentie:</strong> ${frequency || 'daily'}</p>
      `
    })

    // Hier zou je normaal de email naar een database schrijven
    console.log('Newsletter signup:', { email, frequency, categories })

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