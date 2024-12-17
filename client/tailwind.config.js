/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'header': '#59469A',
        'light': '#7C65CB',
        'text': '#C0BBD5',
        'nav': '#251C44',
        'backgr': '#140D2A',
        'stroke': '#5C5B60',
        'hover-btn': '#B6AAE0'
      },
      textColor: {
        DEFAULT: '#7C65CB'
      },
      fontFamily: {
        logo: ['Passion One', 'sans-serif'],
        main: ['Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}