/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  //content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundSize: {
        'normal': 'auto 100% !important',
        'zoomed': 'auto 110% !important'
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}

