/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canine: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#1e293b',
          900: '#0f172a',
          950: '#060b13',
          accent: '#06b6d4',
          bone: '#e8dec8',
          boneHighlight: '#38bdf8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Sarabun', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
