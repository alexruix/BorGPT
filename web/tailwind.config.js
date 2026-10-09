/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stage: {
          bg: '#0a0b0e',
          surface: '#12141a',
          card: '#181b24',
          elevated: '#222634',
          border: '#2e3448',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#f5d77f',
          dim: '#8c7322',
        },
        thought: {
          gold: '#fbbf24',
          bg: 'rgba(251, 191, 36, 0.07)',
          border: 'rgba(251, 191, 36, 0.35)',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        display: ['Cinzel', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
