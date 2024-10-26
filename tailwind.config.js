/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom colors here if needed
      },
      spacing: {
        // You can add custom spacing if needed
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enables dark mode with 'class' strategy
};
