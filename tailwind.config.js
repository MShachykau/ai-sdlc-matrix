/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ai-enabled': {
          DEFAULT: '#1D9E75',
          light: '#E1F5EE',
          dark: '#157a5a',
        },
        'ai-first': {
          DEFAULT: '#378ADD',
          light: '#E6F1FB',
          dark: '#2266b3',
        },
        'ai-native': {
          DEFAULT: '#7F77DD',
          light: '#EEEDFE',
          dark: '#5a53b3',
        },
      },
    },
  },
  plugins: [],
}

