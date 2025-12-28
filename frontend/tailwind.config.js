/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'pastel-main': 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
        'pastel-button': 'linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2))',
      },
      colors: {
        'pastel-text': '#2d3748',
      }
    },
  },
  plugins: [],
}

