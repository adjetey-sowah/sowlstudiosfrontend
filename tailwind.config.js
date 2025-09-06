/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef9e8',
          100: '#fef2c5',
          200: '#fde58e',
          300: '#fbd34d',
          400: '#fab321',
          500: '#f59810',
          600: '#db7109',
          700: '#b6500a',
          800: '#93400f',
          900: '#793610',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#ebeef3',
          200: '#d2dae5',
          300: '#aabbd0',
          400: '#7b96b6',
          500: '#5a789d',
          600: '#476184',
          700: '#3b4f6b',
          800: '#344259',
          900: '#2d384a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'soft-xl': '0 20px 27px rgba(0, 0, 0, 0.05)',
        'soft-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.07)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};
