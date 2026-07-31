/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '28px', // Guidelines required rounded corners
      },
      colors: {
        brand: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          dark: '#0a0f1d',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 0 50px rgba(139, 92, 246, 0.03)',
        'premium-hover': '0 30px 60px -20px rgba(0, 0, 0, 0.1), 0 0 60px rgba(139, 92, 246, 0.06)',
      }
    },
  },
  plugins: [],
}
