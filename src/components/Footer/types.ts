export interface NewsletterFormData {
  email: string
}

export interface NewsletterResponse {
  success: boolean
  message: string
  error?: string
}

export interface FooterProps {
  className?: string
}

export type SocialIconType = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube'