/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#031f13', // Deep ultra-dark forest green
        },
        leaf: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        pale: {
          DEFAULT: '#ecfdf5',
          light: '#f0fdf4',
          border: '#a7f3d0',
        },
        ecoDark: {
          bg: '#04130d',
          surface: '#092117',
          card: '#0f2c20',
          border: '#1b4332',
          hover: '#184936',
          text: '#ecfdf5',
          muted: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(6, 78, 59, 0.06), 0 2px 6px -1px rgba(6, 78, 59, 0.04)',
        'card-hover': '0 12px 32px -4px rgba(6, 78, 59, 0.12), 0 4px 12px -2px rgba(6, 78, 59, 0.06)',
        'glow-sm': '0 0 15px rgba(16, 185, 129, 0.25)',
        'glow-lg': '0 0 35px rgba(16, 185, 129, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
