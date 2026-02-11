/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#eef9ff', 100: '#d9f1ff', 200: '#bce7ff', 300: '#8ed9ff', 400: '#59c2ff', 500: '#33a5ff', 600: '#1b87f5', 700: '#146fe1', 800: '#175ab6', 900: '#194d8f', 950: '#143057' },
      },
    },
  },
  plugins: [],
};
