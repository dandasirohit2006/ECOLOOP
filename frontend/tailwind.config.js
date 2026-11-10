/** @type {import('tailwindcss').Config} */
export default {
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
          950: '#062d1c', // Deep dark forest green
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
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(6, 78, 59, 0.06), 0 2px 6px -1px rgba(6, 78, 59, 0.04)',
        'card-hover': '0 12px 32px -4px rgba(6, 78, 59, 0.12), 0 4px 12px -2px rgba(6, 78, 59, 0.06)',
      },
    },
  },
  plugins: [],
}
