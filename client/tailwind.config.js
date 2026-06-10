/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0a0a0f',
          surface: '#12121a',
          elevated: '#1a1a26',
        },
        border: {
          subtle: '#2a2a3e',
          DEFAULT: '#3a3a55',
        },
        purple: {
          subtle: '#1e1030',
          DEFAULT: '#7c3aed',
          glow: '#a855f7',
          bright: '#c084fc',
        },
        text: {
          primary: '#f0f0f5',
          secondary: '#8888aa',
          muted: '#55556a',
        },
        status: {
          green: '#10b981',
          orange: '#f59e0b',
          blue: '#3b82f6',
          red: '#ef4444',
        },
        category: {
          depin: '#7c3aed',
          ai: '#3b82f6',
          crypto: '#f59e0b',
          tech: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'purple-glow': 'radial-gradient(ellipse at top, #1e1030 0%, #0a0a0f 70%)',
        'card-gradient': 'linear-gradient(135deg, #12121a 0%, #1a1a26 100%)',
      },
      boxShadow: {
        'purple-sm': '0 0 10px rgba(124, 58, 237, 0.2)',
        'purple-md': '0 0 20px rgba(124, 58, 237, 0.3)',
        'purple-lg': '0 0 40px rgba(124, 58, 237, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
