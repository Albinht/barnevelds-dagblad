// Centralized theme configuration for article pages
export const articleTheme = {
  // Typography
  fonts: {
    heading: 'Poppins, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, monospace'
  },
  
  // Color palette
  colors: {
    // Brand colors
    primary: '#0F47AF',      // Brand blue
    secondary: '#FCDD0C',    // Brand yellow
    accent: '#8B0000',       // Dark red
    
    // Text colors
    heading: '#1F2937',      // Gray-800
    text: '#374151',         // Gray-700
    muted: '#6B7280',        // Gray-500
    light: '#9CA3AF',        // Gray-400
    
    // Background colors
    background: '#F9FAFB',   // Gray-50
    card: '#FFFFFF',         // White
    border: '#E5E7EB',       // Gray-200
    
    // Status colors
    premium: '#FCDD0C',      // Yellow for premium content
    success: '#10B981',      // Green
    warning: '#F59E0B',      // Amber
    error: '#EF4444'         // Red
  },
  
  // Layout dimensions
  layout: {
    // Container widths
    maxWidth: '1280px',      // 7xl
    contentWidth: '896px',   // 8/12 of container
    sidebarWidth: '320px',   // 4/12 of container
    
    // Spacing
    gutter: '2rem',          // 8 (32px)
    gap: '2rem',             // 8 (32px)
    padding: {
      small: '1rem',         // 4 (16px)
      medium: '1.5rem',      // 6 (24px)
      large: '2rem',         // 8 (32px)
      xlarge: '3rem'         // 12 (48px)
    },
    
    // Border radius
    radius: {
      small: '0.375rem',     // rounded-md
      medium: '0.5rem',      // rounded-lg
      large: '0.75rem',      // rounded-xl
      full: '9999px'         // rounded-full
    }
  },
  
  // Typography scales
  typography: {
    // Font sizes
    fontSize: {
      xs: '0.75rem',         // 12px
      sm: '0.875rem',        // 14px
      base: '1rem',          // 16px
      lg: '1.125rem',        // 18px
      xl: '1.25rem',         // 20px
      '2xl': '1.5rem',       // 24px
      '3xl': '1.875rem',     // 30px
      '4xl': '2.25rem',      // 36px
      '5xl': '3rem'          // 48px
    },
    
    // Line heights
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    },
    
    // Font weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    }
  },
  
  // Component-specific styles
  components: {
    article: {
      // Article content area
      maxWidth: '65ch',        // Optimal reading width
      fontSize: '1.125rem',    // 18px for better readability
      lineHeight: '1.7',       // Comfortable line height
      
      // Headings within article
      h1: { fontSize: '2.25rem', fontWeight: '700', lineHeight: '1.2' },
      h2: { fontSize: '1.875rem', fontWeight: '600', lineHeight: '1.3' },
      h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.4' },
      h4: { fontSize: '1.25rem', fontWeight: '500', lineHeight: '1.5' },
      
      // Paragraph spacing
      paragraphSpacing: '1.5rem'
    },
    
    sidebar: {
      width: '300px',
      gap: '1.5rem',
      cardPadding: '1.5rem'
    },
    
    widgets: {
      borderRadius: '0.5rem',
      shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      padding: '1.5rem',
      titleSize: '1.125rem',
      titleWeight: '700'
    }
  },
  
  // Responsive breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Animation/transition settings
  transitions: {
    fast: '150ms ease-in-out',
    normal: '200ms ease-in-out',
    slow: '300ms ease-in-out'
  },
  
  // Shadow definitions
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  }
} as const

// Helper functions for theme usage
export const getColor = (colorPath: string) => {
  const keys = colorPath.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = articleTheme.colors
  
  for (const key of keys) {
    value = value?.[key]
  }
  
  return value || '#000000'
}

export const getFontSize = (size: keyof typeof articleTheme.typography.fontSize) => {
  return articleTheme.typography.fontSize[size]
}

export const getSpacing = (size: keyof typeof articleTheme.layout.padding) => {
  return articleTheme.layout.padding[size]
}

// Theme CSS custom properties generator (for use in CSS-in-JS or style tags)
export const generateCSSCustomProperties = () => {
  return `
    :root {
      --theme-color-primary: ${articleTheme.colors.primary};
      --theme-color-secondary: ${articleTheme.colors.secondary};
      --theme-color-accent: ${articleTheme.colors.accent};
      --theme-color-heading: ${articleTheme.colors.heading};
      --theme-color-text: ${articleTheme.colors.text};
      --theme-color-muted: ${articleTheme.colors.muted};
      --theme-color-background: ${articleTheme.colors.background};
      --theme-color-card: ${articleTheme.colors.card};
      --theme-color-border: ${articleTheme.colors.border};
      
      --theme-font-heading: ${articleTheme.fonts.heading};
      --theme-font-body: ${articleTheme.fonts.body};
      
      --theme-layout-max-width: ${articleTheme.layout.maxWidth};
      --theme-layout-content-width: ${articleTheme.layout.contentWidth};
      --theme-layout-sidebar-width: ${articleTheme.layout.sidebarWidth};
      --theme-layout-gutter: ${articleTheme.layout.gutter};
    }
  `
}