// /** @type {import('tailwindcss').Config} */
// This is a Tailwind CSS configuration file that specifies the content files to scan for class names.
// tailwind.config.js 002
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Adjust the path to your HTML and TypeScript files
  ],
  theme: {
      extend: {
        colors: {
          'verde-claro': '#76B177',
          'hover-verde-claro': '#F3FEF5',
          'hover-verde': '#DDFBD9',
          'verde-eureka': '#6FCF97', // Cambia este valor por el tono que prefieras
        }
      }
  },
  plugins: [],
}
