export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      animation: { 'fade-in': 'fadeIn 0.2s ease-in-out' },
      keyframes: { fadeIn: { '0%': { opacity: 0, transform: 'translateY(4px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } } },
    },
  },
  plugins: [],
}
