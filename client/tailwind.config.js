/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // This overrides the default 'font-sans' to use Inter globally
        sans: ['Inter', 'sans-serif'],
      },
      // You can also drop your color palette in here too!
      colors: {
        'wild-teal': '#1A535B',
        'alert-red': '#E04040',
        'risk-orange': '#D4A373',
      }
    },
  },
  plugins: [],
}