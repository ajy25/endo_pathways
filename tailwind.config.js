/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Level encoding: blue (low) → gray (normal) → red (high)
        level: {
          'very-low': '#1e3a8a',
          low: '#3b82f6',
          normal: '#9ca3af',
          high: '#ef4444',
          'very-high': '#991b1b',
        },
        clamp: {
          ring: '#facc15',
        },
        canvas: {
          bg: '#0f172a',
          panel: '#1e293b',
          border: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
