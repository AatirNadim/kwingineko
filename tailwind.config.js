/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#272822', surface: '#1e1f1c', focus: '#414339', line: '#45463e',
        ink: '#f8f8f2', muted: '#b4b19e', pink: '#f92672', lime: '#a6e22e',
        yellow: '#e6db74', violet: '#ae81ff',
      },
      fontFamily: {
        display: ['IBM Plex Sans', 'Noto Sans Devanagari', 'Noto Sans JP', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        sans: ['IBM Plex Sans', 'sans-serif'],
      },
      boxShadow: { panel: '3px 3px 0 rgb(0 0 0 / 20%)' },
    },
  },
  plugins: [],
};
