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
        electricGreen: {
          DEFAULT: '#00FF41',
          dark: '#00D135',
          light: '#33FF67',
        },
        darkBg: {
          DEFAULT: '#0A0A0A',
          lighter: '#1A1A1A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
