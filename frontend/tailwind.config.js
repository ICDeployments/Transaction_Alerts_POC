/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        'cognizant-blue': '#0066CC',
        'alert-red': '#DC2626',
        'alert-yellow': '#F59E0B',
        'alert-orange': '#FF8C42',
      }
    },
  },
  plugins: [],
}
