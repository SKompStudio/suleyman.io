/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // JARVIS command-center surfaces: near-black base, faintly cool panels.
        ink: {
          bg: '#06080B',
          surface: '#0C1016',
          border: '#1A2330',
          text: '#E8EDF2',
          muted: '#7C8896',
        },
        // Primary "system" accent — arc-reactor cyan. Used with restraint for
        // the live/active glow, links, and the online pulse.
        accent: {
          DEFAULT: '#5BC8FF',
          dim: '#10314A',
        },
        // Status/live signal shares the cyan family (one coherent HUD).
        signal: {
          DEFAULT: '#5BC8FF',
          dim: '#10314A',
        },
        // Rare warm micro-accent — Iron-Man gold. A whisper, not a coat.
        gold: {
          DEFAULT: '#E8B84B',
          dim: '#3A2E12',
        },
        // Lens duality: finance leans cyan-blue, engineering leans warm white.
        finance: '#5BC8FF',
        engineering: '#E6D9B8',
      },
      keyframes: {
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'hairline-sweep': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'boot-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // One-shot hero boot sweep: a thin cyan band crosses the headline once.
        'boot-sweep': {
          '0%': { transform: 'translateX(-110%)', opacity: '0' },
          '20%': { opacity: '0.9' },
          '80%': { opacity: '0.9' },
          '100%': { transform: 'translateX(110%)', opacity: '0' },
        },
        // Subtle online pulse on the system console dot.
        'online-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        // Directional data-pulse traveling along a console link (offset shift).
        'data-pulse': {
          '0%': { strokeDashoffset: '24', opacity: '0' },
          '15%': { opacity: '0.9' },
          '85%': { opacity: '0.9' },
          '100%': { strokeDashoffset: '0', opacity: '0' },
        },
        // Blend vault reveal: a thin cyan scan band sweeps down once as the
        // result unlocks. Transform/opacity only.
        'blend-scan': {
          '0%': { transform: 'translateY(-110%)', opacity: '0' },
          '20%': { opacity: '0.85' },
          '80%': { opacity: '0.85' },
          '100%': { transform: 'translateY(110%)', opacity: '0' },
        },
        // The unlocked content rises into place once.
        'blend-unlock': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        // The match ring sweeps in via conic angle (opacity-safe dasharray on SVG).
        'ring-draw': {
          '0%': { strokeDashoffset: 'var(--ring-len)' },
          '100%': { strokeDashoffset: 'var(--ring-target)' },
        },
        // Route-transition boot: arc-reactor ring rotates while the segment is
        // pending. Freezes to a static ring under reduced motion via the global
        // floor + the per-element motion-reduce override.
        'boot-ring-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // Mono status lines resolve in, staggered. Opacity + small lift only.
        'boot-line-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Terminal caret blink — opacity only, reduced-motion floor steadies it.
        'caret-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        // Command-palette open — opacity + tiny scale, transform/opacity only.
        'palette-in': {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'reveal-up': 'reveal-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'hairline-sweep': 'hairline-sweep 6s ease-in-out infinite alternate',
        'boot-in': 'boot-in 0.6s ease-out both',
        'boot-sweep': 'boot-sweep 0.7s ease-out 1 both',
        'online-pulse': 'online-pulse 2.4s ease-in-out infinite',
        'data-pulse': 'data-pulse 2.6s linear infinite',
        'blend-scan': 'blend-scan 1.1s ease-out 1 both',
        'blend-unlock': 'blend-unlock 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'ring-draw': 'ring-draw 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s both',
        'boot-ring-spin': 'boot-ring-spin 0.9s linear infinite',
        'boot-line-in': 'boot-line-in 0.25s ease-out both',
        'caret-blink': 'caret-blink 1.05s step-end infinite',
        'palette-in': 'palette-in 0.14s ease-out both',
      },
    },
    fontSize: {
      xs: ['0.8125rem', { lineHeight: '1.5rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.75rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '2rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '3.5rem' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    typography: (theme) => ({
      invert: {
        css: {
          '--tw-prose-body': 'var(--tw-prose-invert-body)',
          '--tw-prose-headings': 'var(--tw-prose-invert-headings)',
          '--tw-prose-links': 'var(--tw-prose-invert-links)',
          '--tw-prose-links-hover': 'var(--tw-prose-invert-links-hover)',
          '--tw-prose-underline': 'var(--tw-prose-invert-underline)',
          '--tw-prose-underline-hover':
            'var(--tw-prose-invert-underline-hover)',
          '--tw-prose-bold': 'var(--tw-prose-invert-bold)',
          '--tw-prose-counters': 'var(--tw-prose-invert-counters)',
          '--tw-prose-bullets': 'var(--tw-prose-invert-bullets)',
          '--tw-prose-hr': 'var(--tw-prose-invert-hr)',
          '--tw-prose-quote-borders': 'var(--tw-prose-invert-quote-borders)',
          '--tw-prose-captions': 'var(--tw-prose-invert-captions)',
          '--tw-prose-code': 'var(--tw-prose-invert-code)',
          '--tw-prose-code-bg': 'var(--tw-prose-invert-code-bg)',
          '--tw-prose-pre-code': 'var(--tw-prose-invert-pre-code)',
          '--tw-prose-pre-bg': 'var(--tw-prose-invert-pre-bg)',
          '--tw-prose-pre-border': 'var(--tw-prose-invert-pre-border)',
          '--tw-prose-th-borders': 'var(--tw-prose-invert-th-borders)',
          '--tw-prose-td-borders': 'var(--tw-prose-invert-td-borders)',
        },
      },
      DEFAULT: {
        css: {
          '--tw-prose-body': theme('colors.zinc.600'),
          '--tw-prose-headings': theme('colors.zinc.900'),
          '--tw-prose-links': theme('colors.teal.500'),
          '--tw-prose-links-hover': theme('colors.teal.600'),
          '--tw-prose-underline': theme('colors.teal.500 / 0.2'),
          '--tw-prose-underline-hover': theme('colors.teal.500'),
          '--tw-prose-bold': theme('colors.zinc.900'),
          '--tw-prose-counters': theme('colors.zinc.900'),
          '--tw-prose-bullets': theme('colors.zinc.900'),
          '--tw-prose-hr': theme('colors.zinc.100'),
          '--tw-prose-quote-borders': theme('colors.zinc.200'),
          '--tw-prose-captions': theme('colors.zinc.400'),
          '--tw-prose-code': theme('colors.zinc.700'),
          '--tw-prose-code-bg': theme('colors.zinc.300 / 0.2'),
          '--tw-prose-pre-code': theme('colors.zinc.100'),
          '--tw-prose-pre-bg': theme('colors.zinc.900'),
          '--tw-prose-pre-border': 'transparent',
          '--tw-prose-th-borders': theme('colors.zinc.200'),
          '--tw-prose-td-borders': theme('colors.zinc.100'),

          '--tw-prose-invert-body': theme('colors.zinc.400'),
          '--tw-prose-invert-headings': theme('colors.zinc.200'),
          '--tw-prose-invert-links': theme('colors.teal.400'),
          '--tw-prose-invert-links-hover': theme('colors.teal.400'),
          '--tw-prose-invert-underline': theme('colors.teal.400 / 0.3'),
          '--tw-prose-invert-underline-hover': theme('colors.teal.400'),
          '--tw-prose-invert-bold': theme('colors.zinc.200'),
          '--tw-prose-invert-counters': theme('colors.zinc.200'),
          '--tw-prose-invert-bullets': theme('colors.zinc.200'),
          '--tw-prose-invert-hr': theme('colors.zinc.700 / 0.4'),
          '--tw-prose-invert-quote-borders': theme('colors.zinc.500'),
          '--tw-prose-invert-captions': theme('colors.zinc.500'),
          '--tw-prose-invert-code': theme('colors.zinc.300'),
          '--tw-prose-invert-code-bg': theme('colors.zinc.200 / 0.05'),
          '--tw-prose-invert-pre-code': theme('colors.zinc.100'),
          '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 0.4)',
          '--tw-prose-invert-pre-border': theme('colors.zinc.200 / 0.1'),
          '--tw-prose-invert-th-borders': theme('colors.zinc.700'),
          '--tw-prose-invert-td-borders': theme('colors.zinc.800'),

          // Base
          color: 'var(--tw-prose-body)',
          lineHeight: theme('lineHeight.7'),
          '> *': {
            marginTop: theme('spacing.10'),
            marginBottom: theme('spacing.10'),
          },
          p: {
            marginTop: theme('spacing.7'),
            marginBottom: theme('spacing.7'),
          },

          // Headings
          'h2, h3': {
            color: 'var(--tw-prose-headings)',
            fontWeight: theme('fontWeight.semibold'),
          },
          h2: {
            fontSize: theme('fontSize.xl')[0],
            lineHeight: theme('lineHeight.7'),
            marginTop: theme('spacing.20'),
            marginBottom: theme('spacing.4'),
          },
          h3: {
            fontSize: theme('fontSize.base')[0],
            lineHeight: theme('lineHeight.7'),
            marginTop: theme('spacing.16'),
            marginBottom: theme('spacing.4'),
          },
          ':is(h2, h3) + *': {
            marginTop: 0,
          },

          // Images
          img: {
            borderRadius: theme('borderRadius.3xl'),
          },

          // Inline elements
          a: {
            color: 'var(--tw-prose-links)',
            fontWeight: theme('fontWeight.semibold'),
            textDecoration: 'underline',
            textDecorationColor: 'var(--tw-prose-underline)',
            transitionProperty: 'color, text-decoration-color',
            transitionDuration: theme('transitionDuration.150'),
            transitionTimingFunction: theme('transitionTimingFunction.in-out'),
          },
          'a:hover': {
            color: 'var(--tw-prose-links-hover)',
            textDecorationColor: 'var(--tw-prose-underline-hover)',
          },
          strong: {
            color: 'var(--tw-prose-bold)',
            fontWeight: theme('fontWeight.semibold'),
          },
          code: {
            display: 'inline-block',
            color: 'var(--tw-prose-code)',
            fontSize: theme('fontSize.sm')[0],
            fontWeight: theme('fontWeight.semibold'),
            backgroundColor: 'var(--tw-prose-code-bg)',
            borderRadius: theme('borderRadius.lg'),
            paddingLeft: theme('spacing.1'),
            paddingRight: theme('spacing.1'),
          },
          'a code': {
            color: 'inherit',
          },
          ':is(h2, h3) code': {
            fontWeight: theme('fontWeight.bold'),
          },

          // Quotes
          blockquote: {
            paddingLeft: theme('spacing.6'),
            borderLeftWidth: theme('borderWidth.2'),
            borderLeftColor: 'var(--tw-prose-quote-borders)',
            fontStyle: 'italic',
          },

          // Figures
          figcaption: {
            color: 'var(--tw-prose-captions)',
            fontSize: theme('fontSize.sm')[0],
            lineHeight: theme('lineHeight.6'),
            marginTop: theme('spacing.3'),
          },
          'figcaption > p': {
            margin: 0,
          },

          // Lists
          ul: {
            listStyleType: 'disc',
          },
          ol: {
            listStyleType: 'decimal',
          },
          'ul, ol': {
            paddingLeft: theme('spacing.6'),
          },
          li: {
            marginTop: theme('spacing.6'),
            marginBottom: theme('spacing.6'),
            paddingLeft: theme('spacing[3.5]'),
          },
          'li::marker': {
            fontSize: theme('fontSize.sm')[0],
            fontWeight: theme('fontWeight.semibold'),
          },
          'ol > li::marker': {
            color: 'var(--tw-prose-counters)',
          },
          'ul > li::marker': {
            color: 'var(--tw-prose-bullets)',
          },
          'li :is(ol, ul)': {
            marginTop: theme('spacing.4'),
            marginBottom: theme('spacing.4'),
          },
          'li :is(li, p)': {
            marginTop: theme('spacing.3'),
            marginBottom: theme('spacing.3'),
          },

          // Code blocks
          pre: {
            color: 'var(--tw-prose-pre-code)',
            fontSize: theme('fontSize.sm')[0],
            fontWeight: theme('fontWeight.medium'),
            backgroundColor: 'var(--tw-prose-pre-bg)',
            borderRadius: theme('borderRadius.3xl'),
            padding: theme('spacing.8'),
            overflowX: 'auto',
            border: '1px solid',
            borderColor: 'var(--tw-prose-pre-border)',
          },
          'pre code': {
            display: 'inline',
            color: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            backgroundColor: 'transparent',
            borderRadius: 0,
            padding: 0,
          },

          // Horizontal rules
          hr: {
            marginTop: theme('spacing.20'),
            marginBottom: theme('spacing.20'),
            borderTopWidth: '1px',
            borderColor: 'var(--tw-prose-hr)',
            '@screen lg': {
              marginLeft: `calc(${theme('spacing.12')} * -1)`,
              marginRight: `calc(${theme('spacing.12')} * -1)`,
            },
          },

          // Tables
          table: {
            width: '100%',
            tableLayout: 'auto',
            textAlign: 'left',
            fontSize: theme('fontSize.sm')[0],
          },
          thead: {
            borderBottomWidth: '1px',
            borderBottomColor: 'var(--tw-prose-th-borders)',
          },
          'thead th': {
            color: 'var(--tw-prose-headings)',
            fontWeight: theme('fontWeight.semibold'),
            verticalAlign: 'bottom',
            paddingBottom: theme('spacing.2'),
          },
          'thead th:not(:first-child)': {
            paddingLeft: theme('spacing.2'),
          },
          'thead th:not(:last-child)': {
            paddingRight: theme('spacing.2'),
          },
          'tbody tr': {
            borderBottomWidth: '1px',
            borderBottomColor: 'var(--tw-prose-td-borders)',
          },
          'tbody tr:last-child': {
            borderBottomWidth: 0,
          },
          'tbody td': {
            verticalAlign: 'baseline',
          },
          tfoot: {
            borderTopWidth: '1px',
            borderTopColor: 'var(--tw-prose-th-borders)',
          },
          'tfoot td': {
            verticalAlign: 'top',
          },
          ':is(tbody, tfoot) td': {
            paddingTop: theme('spacing.2'),
            paddingBottom: theme('spacing.2'),
          },
          ':is(tbody, tfoot) td:not(:first-child)': {
            paddingLeft: theme('spacing.2'),
          },
          ':is(tbody, tfoot) td:not(:last-child)': {
            paddingRight: theme('spacing.2'),
          },
        },
      },
    }),
  },
}
