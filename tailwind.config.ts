import type { Config } from "tailwindcss";

/**
 * Millux Collections design tokens.
 * Every colour below is derived from the logo artwork (public/images/millux.png):
 * pure black ink, one antique gold, and the white paper the mark sits on.
 */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx}"],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2.5rem', xl: '3rem' },
			screens: { '2xl': '1440px' },
		},
		extend: {
			screens: {
				xs: '480px',
			},
			colors: {
				// ---- Brand (from the logo) ----
				ink: {
					DEFAULT: '#0A0A0A', // wordmark black
					soft: '#1C1B19',    // dark surfaces
				},
				gold: {
					DEFAULT: '#A27627', // "COLLECTIONS" gold on light backgrounds
					deep: '#85601F',    // AA-safe gold for text and links on white
					bright: '#D0A848',  // gold as it appears on the dark lockup
					tint: '#F4EBD8',    // 12% gold wash for subtle highlights
				},
				paper: '#FFFFFF',      // the logo's native background
				stone: '#F5F2EC',      // secondary warm surface
				// ---- Text ----
				body: '#2A2926',
				soft: '#5B5852',   // secondary text
				faint: '#8C887F',  // muted text
				// ---- Lines ----
				line: {
					DEFAULT: '#E4E0D7',
					strong: '#C9C3B6',
				},
				// ---- Functional (kept distinct from the gold) ----
				success: { DEFAULT: '#2E6B45', tint: '#E6F0E9' },
				warning: { DEFAULT: '#B5451B', tint: '#F8E7DF' },
				danger: { DEFAULT: '#A4302A', tint: '#F6E3E1' },

				// ---- shadcn/ui semantic tokens (mapped onto the brand in index.css) ----
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
				secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
				destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
				muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
				accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
				popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
				card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
			},
			fontFamily: {
				display: ['"Bodoni Moda"', 'Didot', '"Playfair Display"', 'Georgia', 'serif'],
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'display-xl': ['clamp(2.75rem, 6vw, 5.5rem)', { lineHeight: '1', letterSpacing: '-0.01em' }],
				'display-lg': ['clamp(2.25rem, 4.5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
				'display-md': ['clamp(1.75rem, 3vw, 2.75rem)', { lineHeight: '1.1' }],
				'display-sm': ['clamp(1.375rem, 2.2vw, 1.875rem)', { lineHeight: '1.2' }],
				label: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.18em' }],
			},
			letterSpacing: {
				brand: '0.22em',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			maxWidth: {
				site: '1440px',
			},
			keyframes: {
				'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
				'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
				'fade-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-up': 'fade-up 0.5s ease-out both',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
