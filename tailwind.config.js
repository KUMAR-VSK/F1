/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        f1red: '#e10600',
        dark: '#15151e',
        darker: '#0a0a0c',
        card: '#1f1f27'
      }
    },
  },
  plugins: [],
}
