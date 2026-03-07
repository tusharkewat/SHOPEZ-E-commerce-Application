/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'shop-blue': '#5A4BFF',
        'shop-blue-hover': '#4a3dec',
      }
    },
  },
  plugins: [],
}
