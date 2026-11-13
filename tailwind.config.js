/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 50: '#EEF3FB', 100: '#D9E4F5', 600: '#14397D', 700: '#0F2D66', 800: '#0B2250', 900: '#071735' },
        brand: { DEFAULT: '#F58220', dark: '#D96A0B', light: '#FFE9D2' },
        ash: '#F4F6FA',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
