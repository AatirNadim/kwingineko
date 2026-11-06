/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#171814',
        surface: '#1e1f1c',
        'surface-card': '#20211e',
        'surface-inset': '#141512',
        'surface-well': '#242520',
        focus: '#414339',
        line: '#45463e',
        'line-subtle': '#36372f',
        ink: '#f8f8f2',
        'ink-secondary': '#d6d4c5',
        muted: '#b4b19e',
        'muted-dim': '#88846f',
        pink: '#f92672',
        lime: '#a6e22e',
        yellow: '#e6db74',
        violet: '#ae81ff',
      },
      fontFamily: {
        display: ['IBM Plex Sans', 'Noto Sans Devanagari', 'Noto Sans JP', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        sans: ['IBM Plex Sans', 'sans-serif'],
      },
      boxShadow: {
        panel: '3px 3px 0 rgb(0 0 0 / 25%)',
        'panel-sm': '2px 2px 0 rgb(0 0 0 / 25%)',
        'panel-lg': '5px 5px 0 rgb(0 0 0 / 30%)',
      },
    },
  },
  plugins: [],
};
