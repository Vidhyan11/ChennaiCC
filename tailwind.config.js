/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chennai-blue': '#1E3A8A',
        'chennai-blue-dark': '#1E293B',
      },
    },
  },
  plugins: [],
}
