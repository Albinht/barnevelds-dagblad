import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, EMAIL_CONFIG } from '@/lib/email'
import { getTipEmailTemplates } from '@/lib/email-templates'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Genereer email templates
    const { adminEmail, confirmationEmail } = getTipEmailTemplates(body)

    // Stuur email naar admin
    const adminResult = await sendEmail({
      to: EMAIL_CONFIG.adminEmail,
      subject: adminEmail.subject,
      html: adminEmail.html
    })

    // Stuur bevestigingsmail naar tipgever (alleen als niet anoniem en email opgegeven)
    if (confirmationEmail) {
      const confirmResult = await sendEmail({
        to: body.email,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html
      })

      if (!confirmResult.success) {
        console.error('Failed to send confirmation email:', confirmResult.error)
      }
    }

    if (!adminResult.success) {
      console.error('Failed to send admin email:', adminResult.error)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Bedankt voor uw tip! We gaan er direct mee aan de slag.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Tip submission error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Er ging iets mis. Probeer het later opnieuw.'
      },
      { status: 500 }
    )
  }
}