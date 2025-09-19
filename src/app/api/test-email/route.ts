import { NextRequest, NextResponse } from 'next/server'
import { BD_LOGO_BASE64 } from '@/lib/email-logo'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to } = body

    if (!to) {
      return NextResponse.json(
        { success: false, message: 'Email address is required' },
        { status: 400 }
      )
    }

    // Dynamic import for nodemailer
    const nodemailer = await import('nodemailer')

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.zxcs.nl',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    const htmlContent = `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test E-mail</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header met logo -->
          <tr>
            <td style="background-color: #1e40af; padding: 30px 20px; text-align: center;">
              <img src="${BD_LOGO_BASE64}" alt="Barnevelds Dagblad" style="width: 120px; height: 120px; display: block; margin: 0 auto 15px auto;"/>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Barnevelds Dagblad</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1e40af; margin-bottom: 20px;">Test E-mail</h2>
              <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                Dit is een test e-mail om te verifiëren dat de SMTP configuratie correct werkt.
              </p>
              <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
                <strong>SMTP Server:</strong> ${process.env.SMTP_HOST}<br>
                <strong>Port:</strong> ${process.env.SMTP_PORT}<br>
                <strong>From:</strong> ${process.env.SMTP_FROM}<br>
                <strong>Timestamp:</strong> ${new Date().toLocaleString('nl-NL')}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #dee2e6;">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                © ${new Date().getFullYear()} Barnevelds Dagblad - Altijd op zoek naar het laatste nieuws
              </p>
              <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 12px;">
                <a href="https://barneveldsdagblad.nl" style="color: #1e40af; text-decoration: none;">barneveldsdagblad.nl</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    const mailOptions = {
      from: process.env.SMTP_FROM || 'redactie@barneveldsdagblad.nl',
      to,
      subject: 'Test E-mail - Barnevelds Dagblad',
      html: htmlContent
    }

    const info = await transporter.sendMail(mailOptions)

    console.log('📧 Email sent successfully:', {
      messageId: info.messageId,
      to,
      subject: mailOptions.subject
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Test email sent successfully',
        data: {
          messageId: info.messageId,
          accepted: info.accepted,
          response: info.response
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error sending test email',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}