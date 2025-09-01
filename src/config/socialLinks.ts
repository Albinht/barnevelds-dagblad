export interface SocialLink {
  name: string
  href: string
  icon: string
  ariaLabel: string
}

export const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    href: "https://facebook.com/barnevelds-dagblad",
    icon: "facebook",
    ariaLabel: "Volg Barnevelds Dagblad op Facebook"
  },
  {
    name: "Twitter",
    href: "https://twitter.com/barnevelds_dagblad",
    icon: "twitter", 
    ariaLabel: "Volg Barnevelds Dagblad op Twitter"
  },
  {
    name: "Instagram",
    href: "https://instagram.com/barnevelds_dagblad",
    icon: "instagram",
    ariaLabel: "Volg Barnevelds Dagblad op Instagram"
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/barnevelds-dagblad",
    icon: "linkedin",
    ariaLabel: "Volg Barnevelds Dagblad op LinkedIn"
  },
  {
    name: "YouTube",
    href: "https://youtube.com/barnevelds-dagblad",
    icon: "youtube",
    ariaLabel: "Bekijk Barnevelds Dagblad op YouTube"
  }
]