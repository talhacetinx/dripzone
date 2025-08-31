/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFFEF0',
          100: '#FFFCE0',
          200: '#FFF9C2',
          300: '#FFF685',
          400: '#FFF347',
          500: '#FAFB00',
          600: '#E6E200',
          700: '#B3B000',
          800: '#808000',
          900: '#4D4D00',
        },
        secondary: {
          50: '#F8F8F8',
          100: '#F0F0F0',
          200: '#E0E0E0',
          300: '#C0C0C0',
          400: '#808080',
          500: '#404040',
          600: '#303030',
          700: '#202020',
          800: '#101010',
          900: '#000000',
        },
        accent: {
          50: '#FFFEF0',
          100: '#FFFCE0',
          200: '#FFF9C2',
          300: '#FFF685',
          400: '#FFF347',
          500: '#FAFB00',
          600: '#E6E200',
          700: '#B3B000',
          800: '#808000',
          900: '#4D4D00',
        },
        dark: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(250, 251, 0, 0.15)',
        'glow-lg': '0 0 40px rgba(250, 251, 0, 0.15)',
        'yellow-glow': '0 0 30px rgba(250, 251, 0, 0.3)',
        'yellow-glow-lg': '0 0 60px rgba(250, 251, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'main-gradient': 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #fafb00 50%, #1a1a1a 75%, #000000 100%)',
        'hero-gradient': 'linear-gradient(135deg, #000000 0%, #0a0a0a 30%, #fafb00 60%, #0a0a0a 90%, #000000 100%)',
      },
    },
  },
  plugins: [],
}

