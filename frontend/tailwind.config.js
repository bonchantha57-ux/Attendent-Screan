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
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        navy: {
          800: '#0f172a',
          900: '#0b1120',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['"Kantumruy Pro"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        khmer: ['"Kantumruy Pro"', 'sans-serif'],
        heading: ['"Kantumruy Pro"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      screens: {
        'xs': '375px',
      }
    },
  },
  plugins: [],
}
