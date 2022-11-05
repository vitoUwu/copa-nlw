/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Roboto, sans-serif'
      },
      colors: {
        gray: {
          100: '#e1e1e6',
          300: '#8d8d99',
          800: '#202024',
          900: '#121214'
        },
        ignite: {
          500: '#129e57'
        },
        yellow: {
          500: '#f7dd43',
          600: '#e5cd3d'
        }
      },
    },
  },
  plugins: [],
}
