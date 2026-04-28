/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--c-accent-deep)',
        secondary: 'var(--c-accent-dark)',
        accent: 'var(--c-accent)',
        'accent-dark': 'var(--c-accent-dark)',
        'accent-deep': 'var(--c-accent-deep)',
        surface: 'var(--c-surface)',
        'surface-alt': 'var(--c-surface-alt)',
        'page-bg': 'var(--c-bg)',
        'text-primary': 'var(--c-text-primary)',
        'text-secondary': 'var(--c-text-secondary)',
        'text-muted': 'var(--c-text-muted)',
        border: 'var(--c-border)',
        success: 'var(--c-success)',
        error: 'var(--c-error)',
        warning: 'var(--c-warning)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'neu': '6px 6px 14px var(--neu-dark), -6px -6px 14px var(--neu-light)',
        'neu-sm': '3px 3px 8px var(--neu-dark), -3px -3px 8px var(--neu-light)',
        'neu-lg': '10px 10px 20px var(--neu-dark), -10px -10px 20px var(--neu-light)',
        'neu-inset': 'inset 3px 3px 8px var(--neu-dark), inset -3px -3px 8px var(--neu-light)',
        'neu-inset-sm': 'inset 2px 2px 5px var(--neu-dark), inset -2px -2px 5px var(--neu-light)',
        'neu-pressed': 'inset 4px 4px 10px var(--neu-dark), inset -4px -4px 10px var(--neu-light)',
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