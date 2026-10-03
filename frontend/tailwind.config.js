/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#D32F2F",       // Mr. Office brand red
          redDark: "#B71C1C",
          redLight: "#FFEBEE",
          navy: "#1E295A",      // Mr. Office brand navy
          navyDark: "#0F172A",
          navyLight: "#F0F3FA",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(30, 41, 90, 0.08)',
        'card': '0 10px 30px -4px rgba(30, 41, 90, 0.1)',
      }
    },
  },
  plugins: [],
}
