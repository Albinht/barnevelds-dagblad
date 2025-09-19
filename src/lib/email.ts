import { BD_LOGO_BASE64 } from './email-logo'

// Email configuratie
export const EMAIL_CONFIG = {
  from: process.env.SMTP_FROM || 'redactie@barneveldsdagblad.nl',
  adminEmail: process.env.SMTP_FROM || 'redactie@barneveldsdagblad.nl',
  replyTo: process.env.SMTP_FROM || 'redactie@barneveldsdagblad.nl'
}

// Email versturen functie
export async function sendEmail({
  to,
  subject,
  html,
  text
}: {
  to: string
  subject: string
  html: string
  text?: string
}) {
  // Development mode zonder SMTP
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
    console.log('📧 Development mode - Email would be sent to:', to)
    console.log('Subject:', subject)
    console.log('---')
    return { success: true, id: 'dev-mode' }
  }

  try {
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

    const mailOptions = {
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html,
      text: text || stripHtml(html),
      replyTo: EMAIL_CONFIG.replyTo
    }

    const info = await transporter.sendMail(mailOptions)

    console.log('📧 Email sent successfully:', {
      messageId: info.messageId,
      to,
      subject
    })

    return { success: true, data: info }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error }
  }
}

// Helper functie om HTML naar plain text te converteren
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

// Logo is imported from email-logo.ts

// Basis email template
export function getEmailTemplate({
  title,
  content,
  showLogo = true
}: {
  title: string
  content: string
  showLogo?: boolean
}) {
  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          ${showLogo ? `
          <!-- Header met logo -->
          <tr>
            <td style="background-color: #1e40af; padding: 30px 20px; text-align: center;">
              <img src="${BD_LOGO_BASE64}" alt="Barnevelds Dagblad" style="width: 120px; height: 120px; display: block; margin: 0 auto 15px auto;"/>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Barnevelds Dagblad</h1>
            </td>
          </tr>
          ` : ''}

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
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
}