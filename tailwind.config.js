/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sci-fi color palette
        'sci-black': '#000000',
        'sci-gray': {
          100: '#2a2a2a',
          200: '#1a1a1a',
          300: '#111111',
        },
        'sci-cyan': '#00d4ff',
        'sci-blue': '#0066ff',
        'sci-purple': '#8b5cf6',
        'sci-white': '#ffffff',
        'sci-light-gray': '#e5e5e5',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-black-to-dark-blue': 'linear-gradient(to bottom right, #000000, #1e293b, #1e3a8a)',
        'gradient-black-to-purple': 'linear-gradient(to bottom right, #000000, rgba(147, 51, 234, 0.2), rgba(147, 51, 234, 0.1))',
        'gradient-cyan-to-blue': 'linear-gradient(to right, #00d4ff, #0066ff)',
        'gradient-white-to-transparent': 'linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.1))',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 15px #00d4ff' },
          '100%': { boxShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 102, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
};