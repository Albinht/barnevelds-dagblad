/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FCDD0C",
          blue: "#0F47AF",
          white: "#FFFFFF",
          darkred: "#8B0000"
        }
      },
      fontFamily: {
        'newspaper': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'newspaper': '0.05em',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            p: {
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.4'),
            },
            h2: {
              color: theme('colors.gray.900'),
              fontSize: theme('fontSize.2xl'),
              fontWeight: theme('fontWeight.semibold'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.4'),
            },
            h3: {
              color: theme('colors.gray.900'),
              fontSize: theme('fontSize.xl'),
              fontWeight: theme('fontWeight.semibold'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.3'),
            },
            blockquote: {
              borderLeftColor: '#0F47AF',
              borderLeftWidth: '4px',
              paddingLeft: theme('spacing.4'),
              fontStyle: 'italic',
              color: theme('colors.gray.600'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
            },
            ul: {
              color: theme('colors.gray.700'),
            },
            li: {
              color: theme('colors.gray.700'),
              marginTop: theme('spacing.1'),
              marginBottom: theme('spacing.1'),
            },
            strong: {
              color: theme('colors.gray.900'),
              fontWeight: theme('fontWeight.semibold'),
            },
            a: {
              color: '#0F47AF',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          },
        },
      }),
    }
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
  ],
}