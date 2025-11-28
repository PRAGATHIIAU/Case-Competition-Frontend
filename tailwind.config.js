/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tamu-maroon': '#500000',
        'tamu-maroon-light': '#700000',
        'tamu-maroon-dark': '#300000',
      },
    },
  },
  plugins: [],
}

