import { getEmailTemplate } from './email'

// Contact formulier emails
export function getContactEmailTemplates(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  // Email naar admin
  const adminEmail = {
    subject: `Contact formulier: ${data.subject}`,
    html: getEmailTemplate({
      title: 'Nieuw contact formulier',
      content: `
        <h2 style="color: #1e40af; margin: 0 0 20px 0;">Nieuw contact formulier ontvangen</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Naam:</strong> ${data.name}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.email}</p>
          <p style="margin: 0 0 10px 0;"><strong>Onderwerp:</strong> ${data.subject}</p>
          <p style="margin: 0;"><strong>Bericht:</strong></p>
          <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${data.message}</p>
        </div>
      `
    })
  }

  // Bevestigingsmail naar inzender
  const confirmationEmail = {
    subject: 'Bedankt voor uw bericht - Barnevelds Dagblad',
    html: getEmailTemplate({
      title: 'Bedankt voor uw bericht',
      content: `
        <h2 style="color: #1e40af; margin: 0 0 20px 0;">Bedankt voor uw bericht!</h2>
        <p style="margin: 0 0 15px 0;">Beste ${data.name},</p>
        <p style="margin: 0 0 15px 0;">We hebben uw bericht over "<strong>${data.subject}</strong>" in goede orde ontvangen.</p>
        <p style="margin: 0 0 20px 0;">Ons team zal uw vraag of opmerking zo spoedig mogelijk behandelen. U kunt binnen 48 uur een reactie van ons verwachten.</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="color: #495057; margin: 0 0 10px 0; font-size: 16px;">Uw bericht:</h3>
          <p style="margin: 0; color: #6c757d; white-space: pre-wrap;">${data.message}</p>
        </div>

        <p style="margin: 20px 0 0 0;">Met vriendelijke groet,</p>
        <p style="margin: 5px 0 0 0;"><strong>Team Barnevelds Dagblad</strong></p>
      `
    })
  }

  return { adminEmail, confirmationEmail }
}

// Tip de redactie emails
export function getTipEmailTemplates(data: {
  name?: string
  email?: string
  phone?: string
  anonymous: boolean
  tipTitle: string
  tipDescription: string
  location?: string
  datetime?: string
  hasMedia: boolean
}) {
  const tipperName = data.anonymous ? 'Anoniem' : data.name || 'Onbekend'

  // Email naar admin
  const adminEmail = {
    subject: `Nieuwstip: ${data.tipTitle}`,
    html: getEmailTemplate({
      title: 'Nieuwe nieuwstip',
      content: `
        <h2 style="color: #dc2626; margin: 0 0 20px 0;">🔴 Nieuwe nieuwstip ontvangen</h2>
        <div style="background-color: #fef2f2; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #991b1b;">${data.tipTitle}</h3>
          <p style="margin: 0; white-space: pre-wrap;">${data.tipDescription}</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
          <p style="margin: 0 0 8px 0;"><strong>Tipgever:</strong> ${tipperName}</p>
          ${!data.anonymous && data.email ? `<p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${data.email}</p>` : ''}
          ${!data.anonymous && data.phone ? `<p style="margin: 0 0 8px 0;"><strong>Telefoon:</strong> ${data.phone}</p>` : ''}
          ${data.location ? `<p style="margin: 0 0 8px 0;"><strong>Locatie:</strong> ${data.location}</p>` : ''}
          ${data.datetime ? `<p style="margin: 0 0 8px 0;"><strong>Datum/tijd:</strong> ${new Date(data.datetime).toLocaleString('nl-NL')}</p>` : ''}
          ${data.hasMedia ? '<p style="margin: 0; color: #059669;"><strong>📷 Tipgever heeft foto\'s/video\'s</strong></p>' : ''}
        </div>
      `
    })
  }

  // Bevestigingsmail naar tipgever (alleen als niet anoniem)
  const confirmationEmail = !data.anonymous && data.email ? {
    subject: 'Bedankt voor uw nieuwstip - Barnevelds Dagblad',
    html: getEmailTemplate({
      title: 'Bedankt voor uw nieuwstip',
      content: `
        <h2 style="color: #1e40af; margin: 0 0 20px 0;">Bedankt voor uw tip!</h2>
        <p style="margin: 0 0 15px 0;">Beste ${data.name || 'nieuwstipper'},</p>
        <p style="margin: 0 0 15px 0;">We hebben uw tip "<strong>${data.tipTitle}</strong>" ontvangen. Onze redactie gaat direct aan de slag om te beoordelen of we hier een artikel aan kunnen wijden.</p>

        ${data.hasMedia ? `
        <div style="background-color: #dcfce7; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #166534;"><strong>📷 Foto's/video's insturen</strong></p>
          <p style="margin: 10px 0 0 0;">U gaf aan beeldmateriaal te hebben. Stuur deze als bijlage naar: <a href="mailto:redactie@barneveldsdagblad.nl" style="color: #1e40af;">redactie@barneveldsdagblad.nl</a></p>
        </div>
        ` : ''}

        <p style="margin: 20px 0 0 0;">Elke tip helpt ons om Barneveld volledig te informeren. Bedankt voor uw bijdrage!</p>
        <p style="margin: 20px 0 0 0;">Met vriendelijke groet,</p>
        <p style="margin: 5px 0 0 0;"><strong>Redactie Barnevelds Dagblad</strong></p>
      `
    })
  } : null

  return { adminEmail, confirmationEmail }
}

// Persbericht emails
export function getPersberichtEmailTemplates(data: {
  organization: string
  contactName: string
  email: string
  phone: string
  title: string
  subtitle?: string
  content: string
  embargo: boolean
  embargoDate?: string
  hasAttachments: boolean
}) {
  // Email naar admin
  const adminEmail = {
    subject: `Persbericht: ${data.title} - ${data.organization}`,
    html: getEmailTemplate({
      title: 'Nieuw persbericht',
      content: `
        <h2 style="color: #1e40af; margin: 0 0 20px 0;">Nieuw persbericht ontvangen</h2>

        ${data.embargo ? `
        <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 0 0 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>⚠️ EMBARGO tot: ${new Date(data.embargoDate!).toLocaleString('nl-NL')}</strong></p>
        </div>
        ` : ''}

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${data.title}</h3>
          ${data.subtitle ? `<p style="margin: 0 0 15px 0; font-style: italic; color: #6c757d;">${data.subtitle}</p>` : ''}
          <p style="margin: 0; white-space: pre-wrap;">${data.content}</p>
        </div>

        <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px;">
          <p style="margin: 0 0 8px 0;"><strong>Organisatie:</strong> ${data.organization}</p>
          <p style="margin: 0 0 8px 0;"><strong>Contactpersoon:</strong> ${data.contactName}</p>
          <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${data.email}</p>
          <p style="margin: 0 0 8px 0;"><strong>Telefoon:</strong> ${data.phone}</p>
          ${data.hasAttachments ? '<p style="margin: 0; color: #059669;"><strong>📎 Er zijn bijlagen</strong></p>' : ''}
        </div>
      `
    })
  }

  // Bevestigingsmail naar inzender
  const confirmationEmail = {
    subject: `Persbericht ontvangen: ${data.title}`,
    html: getEmailTemplate({
      title: 'Persbericht ontvangen',
      content: `
        <h2 style="color: #1e40af; margin: 0 0 20px 0;">Uw persbericht is ontvangen</h2>
        <p style="margin: 0 0 15px 0;">Beste ${data.contactName},</p>
        <p style="margin: 0 0 15px 0;">We hebben het persbericht "<strong>${data.title}</strong>" van ${data.organization} in goede orde ontvangen.</p>

        ${data.embargo ? `
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>Embargo genoteerd</strong></p>
          <p style="margin: 10px 0 0 0;">We zullen dit nieuws niet publiceren voor: ${new Date(data.embargoDate!).toLocaleString('nl-NL')}</p>
        </div>
        ` : ''}

        <p style="margin: 0 0 15px 0;">Onze redactie beoordeelt alle persberichten op nieuwswaarde voor Barneveld en omstreken. Als we besluiten uw persbericht te plaatsen, nemen we indien nodig contact met u op voor aanvullende informatie.</p>

        ${data.hasAttachments ? `
        <div style="background-color: #dcfce7; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #166534;"><strong>📎 Bijlagen insturen</strong></p>
          <p style="margin: 10px 0 0 0;">Stuur uw bijlagen (foto's, documenten) naar: <a href="mailto:redactie@barneveldsdagblad.nl" style="color: #1e40af;">redactie@barneveldsdagblad.nl</a></p>
        </div>
        ` : ''}

        <p style="margin: 20px 0 0 0;">Met vriendelijke groet,</p>
        <p style="margin: 5px 0 0 0;"><strong>Redactie Barnevelds Dagblad</strong></p>
      `
    })
  }

  return { adminEmail, confirmationEmail }
}

// Adverteren emails
export function getAdverterenEmailTemplates(data: {
  company: string
  contactName: string
  email: string
  phone?: string
  adType: string
  budget?: string
  message?: string
}) {
  const adTypes: { [key: string]: string } = {
    'display': 'Display advertenties',
    'sponsored': 'Sponsored content',
    'newsletter': 'Nieuwsbrief sponsoring',
    'vacancy': 'Vacature plaatsing',
    'custom': 'Maatwerk campagne',
    'multiple': 'Combinatie van opties'
  }

  // Email naar admin
  const adminEmail = {
    subject: `Advertentie aanvraag: ${data.company}`,
    html: getEmailTemplate({
      title: 'Nieuwe advertentie aanvraag',
      content: `
        <h2 style="color: #059669; margin: 0 0 20px 0;">💰 Nieuwe advertentie aanvraag</h2>

        <div style="background-color: #f0fdf4; padding: 20px; border-left: 4px solid #059669; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; font-size: 18px;"><strong>${data.company}</strong></p>
          <p style="margin: 0;">Type: <strong>${adTypes[data.adType] || data.adType}</strong></p>
          ${data.budget ? `<p style="margin: 10px 0 0 0;">Budget: <strong>${data.budget}</strong></p>` : ''}
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
          <p style="margin: 0 0 8px 0;"><strong>Contactpersoon:</strong> ${data.contactName}</p>
          <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p style="margin: 0 0 8px 0;"><strong>Telefoon:</strong> ${data.phone}</p>` : ''}
        </div>

        ${data.message ? `
        <div style="margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Aanvullende informatie:</strong></p>
          <p style="margin: 0; white-space: pre-wrap; background-color: #f8f9fa; padding: 15px; border-radius: 4px;">${data.message}</p>
        </div>
        ` : ''}
      `
    })
  }

  // Bevestigingsmail naar aanvrager
  const confirmationEmail = {
    subject: 'Uw advertentie aanvraag - Barnevelds Dagblad',
    html: getEmailTemplate({
      title: 'Bedankt voor uw interesse',
      content: `
        <h2 style="color: #1e40af; margin: 0 0 20px 0;">Bedankt voor uw advertentie aanvraag</h2>
        <p style="margin: 0 0 15px 0;">Beste ${data.contactName},</p>
        <p style="margin: 0 0 15px 0;">We hebben uw aanvraag voor <strong>${adTypes[data.adType] || data.adType}</strong> voor ${data.company} ontvangen.</p>

        <div style="background-color: #e0e7ff; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #3730a3;">Wat gebeurt er nu?</h3>
          <ol style="margin: 10px 0 0 0; padding-left: 20px;">
            <li style="margin: 0 0 8px 0;">Ons sales team bekijkt uw aanvraag</li>
            <li style="margin: 0 0 8px 0;">We nemen binnen 24 uur contact met u op</li>
            <li style="margin: 0 0 8px 0;">We bespreken de mogelijkheden en maken een offerte op maat</li>
            <li style="margin: 0;">Na akkoord kunnen we vaak binnen 48 uur live gaan</li>
          </ol>
        </div>

        <p style="margin: 0 0 15px 0;">Met Barnevelds Dagblad bereikt u dagelijks duizenden lezers uit Barneveld en omstreken. We kijken ernaar uit om samen met u een succesvolle campagne op te zetten.</p>

        <p style="margin: 20px 0 0 0;">Met vriendelijke groet,</p>
        <p style="margin: 5px 0 0 0;"><strong>Sales Team Barnevelds Dagblad</strong></p>
        <p style="margin: 5px 0 0 0; color: #6c757d;">adverteren@barneveldsdagblad.nl</p>
      `
    })
  }

  return { adminEmail, confirmationEmail }
}

// Correctie emails
export function getCorrectieEmailTemplates(data: {
  articleUrl: string
  name: string
  email: string
  correction: string
  evidence?: string
}) {
  // Email naar admin
  const adminEmail = {
    subject: `Correctieverzoek ingediend`,
    html: getEmailTemplate({
      title: 'Correctieverzoek',
      content: `
        <h2 style="color: #dc2626; margin: 0 0 20px 0;">⚠️ Correctieverzoek ontvangen</h2>

        <div style="background-color: #fef2f2; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Artikel:</strong></p>
          <p style="margin: 0;"><a href="${data.articleUrl}" style="color: #1e40af;">${data.articleUrl}</a></p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Gemelde fout:</strong></p>
          <p style="margin: 0; white-space: pre-wrap;">${data.correction}</p>

          ${data.evidence ? `
          <p style="margin: 20px 0 10px 0;"><strong>Onderbouwing:</strong></p>
          <p style="margin: 0; white-space: pre-wrap;">${data.evidence}</p>
          ` : ''}
        </div>

        <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px;">
          <p style="margin: 0 0 8px 0;"><strong>Ingediend door:</strong> ${data.name}</p>
          <p style="margin: 0;"><strong>Email:</strong> ${data.email}</p>
        </div>
      `
    })
  }

  // Bevestigingsmail naar melder
  const confirmationEmail = {
    subject: 'Uw correctieverzoek is ontvangen - Barnevelds Dagblad',
    html: getEmailTemplate({
      title: 'Correctieverzoek ontvangen',
      content: `
        <h2 style="color: #1e40af; margin: 0 0 20px 0;">Bedankt voor uw correctieverzoek</h2>
        <p style="margin: 0 0 15px 0;">Beste ${data.name},</p>
        <p style="margin: 0 0 15px 0;">We hebben uw melding over een mogelijke fout in ons artikel ontvangen. We nemen correcties zeer serieus en waarderen het dat u de tijd heeft genomen om dit aan ons te melden.</p>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; font-size: 16px;">Uw melding:</h3>
          <p style="margin: 0 0 10px 0;"><strong>Artikel:</strong> <a href="${data.articleUrl}" style="color: #1e40af;">Bekijk artikel</a></p>
          <p style="margin: 0; white-space: pre-wrap; color: #6c757d;">${data.correction}</p>
        </div>

        <div style="background-color: #e0e7ff; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #3730a3;"><strong>Wat gebeurt er nu?</strong></p>
          <ul style="margin: 0; padding-left: 20px; color: #4c1d95;">
            <li>Onze redactie beoordeelt uw melding binnen 48 uur</li>
            <li>We verifiëren de feiten</li>
            <li>Bij een feitelijke fout passen we het artikel aan</li>
            <li>U ontvangt altijd een reactie van ons</li>
          </ul>
        </div>

        <p style="margin: 20px 0 0 0;">Met vriendelijke groet,</p>
        <p style="margin: 5px 0 0 0;"><strong>Redactie Barnevelds Dagblad</strong></p>
      `
    })
  }

  return { adminEmail, confirmationEmail }
}

// Nieuwsbrief emails
export function getNewsletterEmailTemplates(data: {
  email: string
  frequency: string
  categories: string[]
}) {
  const frequencies: { [key: string]: string } = {
    'daily': 'Dagelijks (ma-za om 7:00 uur)',
    'weekly': 'Wekelijks (vrijdag om 17:00 uur)',
    'breaking': 'Alleen bij breaking news'
  }

  // Alleen bevestigingsmail (admin email niet nodig voor nieuwsbrief)
  const confirmationEmail = {
    subject: 'Welkom bij de Barnevelds Dagblad nieuwsbrief!',
    html: getEmailTemplate({
      title: 'Welkom!',
      content: `
        <h2 style="color: #1e40af; margin: 0 0 20px 0;">Welkom bij onze nieuwsbrief!</h2>
        <p style="margin: 0 0 15px 0;">Bedankt voor uw aanmelding voor de Barnevelds Dagblad nieuwsbrief.</p>

        <div style="background-color: #dcfce7; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #166534;"><strong>✅ Uw voorkeuren zijn opgeslagen:</strong></p>
          <p style="margin: 0;">Frequentie: <strong>${frequencies[data.frequency]}</strong></p>
        </div>

        <p style="margin: 0 0 15px 0;">U ontvangt binnenkort uw eerste nieuwsbrief met het laatste nieuws uit Barneveld.</p>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #6c757d;">
            <strong>Tip:</strong> Voeg noreply@barneveldsdagblad.nl toe aan uw contacten om er zeker van te zijn dat onze nieuwsbrief in uw inbox belandt.
          </p>
        </div>

        <p style="margin: 20px 0 10px 0; font-size: 14px; color: #6c757d;">
          Wilt u zich uitschrijven? Onderaan elke nieuwsbrief vindt u een uitschrijflink.
        </p>

        <p style="margin: 20px 0 0 0;">Met vriendelijke groet,</p>
        <p style="margin: 5px 0 0 0;"><strong>Team Barnevelds Dagblad</strong></p>
      `
    })
  }

  return { confirmationEmail }
}