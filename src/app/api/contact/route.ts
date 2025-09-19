import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, EMAIL_CONFIG } from '@/lib/email'
import { getContactEmailTemplates } from '@/lib/email-templates'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Genereer email templates
    const { adminEmail, confirmationEmail } = getContactEmailTemplates(body)

    // Stuur email naar admin
    const adminResult = await sendEmail({
      to: EMAIL_CONFIG.adminEmail,
      subject: adminEmail.subject,
      html: adminEmail.html
    })

    // Stuur bevestigingsmail naar inzender
    const confirmResult = await sendEmail({
      to: body.email,
      subject: confirmationEmail.subject,
      html: confirmationEmail.html
    })

    if (!adminResult.success) {
      console.error('Failed to send admin email:', adminResult.error)
    }

    if (!confirmResult.success) {
      console.error('Failed to send confirmation email:', confirmResult.error)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Uw bericht is ontvangen. We nemen binnen 48 uur contact met u op.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Er ging iets mis. Probeer het later opnieuw.'
      },
      { status: 500 }
    )
  }
}