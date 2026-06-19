/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        shell: '#0f1117',
        sidebar: '#1a1d27',
        panel: '#161922',
        border: '#262a36',
        accent: {
          DEFAULT: '#6c63ff',
          hover: '#7d75ff',
          soft: 'rgba(108, 99, 255, 0.12)',
        },
        muted: '#8b90a0',
      },
      transitionDuration: {
        DEFAULT: '180ms',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
