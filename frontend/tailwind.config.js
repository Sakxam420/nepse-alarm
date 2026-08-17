/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        base: '#0e1117',
        card: '#161b27',
        elevated: '#1a2035',
        hover: '#1c2333',
        accent: '#4f8ef7',
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.07)',
        strong: 'rgba(255,255,255,0.13)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
        'fade-in': 'fade-in 0.25s ease forwards',
      },
    },
  },
  plugins: [],
}
