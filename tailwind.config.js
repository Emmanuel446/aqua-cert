/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aqua: {
          DEFAULT: '#1FB6FF',
          50: '#E5F7FF',
          100: '#CCF0FF',
          200: '#99E0FF',
          300: '#66D1FF',
          400: '#33C1FF',
          500: '#1FB6FF',
          600: '#0092CC',
          700: '#006D99',
          800: '#004966',
          900: '#002433',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}