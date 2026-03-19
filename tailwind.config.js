import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        soft: '0 30px 80px rgba(15, 23, 42, 0.10)',
        float: '0 16px 40px rgba(15, 23, 42, 0.12)',
      },
      colors: {
        ink: '#102033',
        mist: '#f5f7fb',
        line: '#dbe3ef',
        accent: '#0f6cdd',
      },
    },
  },
  plugins: [forms],
}
