/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/*.{html,js}",
    "./static/script/*.{js}"
  ],
  theme: {
    extend: {
      colors: {
        backgroundGreen: "#dfe7d5",
        backgroundBrown: "#E3CAA5",
      },
      animation: {
        'bounce-y': 'bounce-y 1s infinite',
      },
      keyframes: {
        'bounce-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25%)' },
        },
      },
    },
    plugins: [],
  }
}
