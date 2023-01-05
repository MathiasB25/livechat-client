/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'app-0': '#383838',
        'app-1': '#353535',
        'app-2': '#323232',
        'app-3': '#2C2C2C',
        'app-4': '#272727',
        'app-5': '#252525',
        'app-6': '#232323',
        'app-7': '#1F1F1F',
        'app-8': '#121212',
      },
    },
  },
  plugins: [],
}
