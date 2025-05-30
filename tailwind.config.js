// /** @type {import('tailwindcss').Config} */
// This is a Tailwind CSS configuration file that specifies the content files to scan for class names.
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Adjust the path to your HTML and TypeScript files
  ],
  theme: {
      extend: {
        colors: {
          'verde-claro': '#76B177',
          'hover-verde-claro': '#F3FEF5',
          'hover-verde': '#DDFBD9'
        }
      }
  },
  plugins: [],
}
