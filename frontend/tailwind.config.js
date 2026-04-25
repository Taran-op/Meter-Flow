/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A97B0',
        secondary: '#7BB8CC',
        accent: '#B7D8E6',
        'accent-dark': '#7BB8CC',
        'accent-deep': '#4A97B0',
        surface: '#E1E5EA',
        'surface-alt': '#D6DAE0',
        'page-bg': '#E1E5EA',
        'text-primary': '#1A2633',
        'text-secondary': '#5A6A78',
        'text-muted': '#8A97A4',
        border: '#CDD2D8',
        success: '#3DAA7A',
        error: '#D95252',
        warning: '#E8A642',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'neu': '6px 6px 14px #bec3c8, -6px -6px 14px #ffffff',
        'neu-sm': '3px 3px 8px #bec3c8, -3px -3px 8px #ffffff',
        'neu-lg': '10px 10px 20px #bec3c8, -10px -10px 20px #ffffff',
        'neu-inset': 'inset 3px 3px 8px #bec3c8, inset -3px -3px 8px #ffffff',
        'neu-inset-sm': 'inset 2px 2px 5px #bec3c8, inset -2px -2px 5px #ffffff',
        'neu-pressed': 'inset 4px 4px 10px #bec3c8, inset -4px -4px 10px #ffffff',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'liquid-shimmer': 'liquidShimmer 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        liquidShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}