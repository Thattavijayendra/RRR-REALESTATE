/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F8F5F0',
        charcoal: '#1A1A1A',
        gold: '#C9A959',
        'gold-light': '#D4B86E',
        'charcoal-light': '#2D2D2D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
