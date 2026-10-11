/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quest: {
          dark: '#090d16',
          card: '#111827',
          surface: '#161f33',
          border: '#23324d',
          neonCyan: '#00f2fe',
          neonGreen: '#10b981',
          neonLime: '#84cc16',
          neonAmber: '#f59e0b',
          neonCoral: '#f43f5e',
          neonPurple: '#a855f7',
          neonPink: '#ec4899',
          rupeeGold: '#fbbf24',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.5s ease-in-out',
        'bounce-soft': 'bounceSoft 2s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(0, 242, 254, 0.6))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 4px rgba(0, 242, 254, 0.2))' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
