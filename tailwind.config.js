/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        sky: {
          50: '#f0f9ff',   // clinical ice/clear wash
          100: '#e0f2fe',  // soft sterile tint
          200: '#b9e6fe',  // subtle medical border
          300: '#7cd4fd',  // soft sky
          400: '#36bfed',  // clean cerulean
          500: '#0086c9',  // clinical mid-blue
          600: '#026aa2',  // surgical precision blue (authoritative, non-vibecoded)
          700: '#005482',  // deep clinical cobalt
          800: '#003d61',  // deep institutional navy
          900: '#002842',  // midnight medical navy
          950: '#001726',
        },
        accent: {
          DEFAULT: '#026aa2', // authoritative clinical blue
          light: '#36bfed',
          dark: '#005482',
          hover: '#0086c9',
          glow: 'rgba(2, 106, 162, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'clinical': '0 10px 30px -10px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
        'clinical-hover': '0 20px 40px -15px rgba(2, 106, 162, 0.12), 0 8px 16px -6px rgba(15, 23, 42, 0.04)',
        'glow': '0 0 25px -5px rgba(2, 106, 162, 0.20)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
