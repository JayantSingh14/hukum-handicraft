/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-gold': '#C8A24A',
        'accent-gold': '#D8B56A',
        'matte-black': '#0F0F0F',
        'ivory-white': '#FAF8F2',
        'charcoal': '#1A1A1A',
        'primary-color': '#0F0F0F',
        'secondary-color': '#C8A24A',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        sans: ['Inter', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 4px 20px -2px rgba(15, 15, 15, 0.05), 0 2px 15px -1px rgba(200, 162, 74, 0.05)',
        'luxury-hover': '0 10px 30px -5px rgba(15, 15, 15, 0.1), 0 4px 20px -2px rgba(200, 162, 74, 0.1)',
      }
    },
  },
  plugins: [],
}