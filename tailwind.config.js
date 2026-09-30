/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        poe: {
          dark: '#0c0d10',
          panel: '#15171e',
          card: '#1b1d26',
          border: '#2a2d3d',
          gold: '#af8949',
          'gold-light': '#d4b26f',
          red: '#c93434',
          green: '#2fa344',
          blue: '#3b78de',
          white: '#e2e8f0',
        }
      }
    },
  },
  plugins: [],
}
