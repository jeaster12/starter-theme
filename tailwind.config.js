/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    "./*.hbs",
    "./partials/**/*.hbs", 
    "./assets/js/**/*.js",
  ],
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
  darkMode: 'class',  
  theme: {  
    extend: {
      colors: {
        gray: {
          '50':  'rgb(var(--color-gray-50) / <alpha-value>)',
          '100': 'rgb(var(--color-gray-100) / <alpha-value>)',
          '200': 'rgb(var(--color-gray-200) / <alpha-value>)',
          '300': 'rgb(var(--color-gray-300) / <alpha-value>)',
          '400': 'rgb(var(--color-gray-400) / <alpha-value>)',
          '500': 'rgb(var(--color-gray-500) / <alpha-value>)',
          '600': 'rgb(var(--color-gray-600) / <alpha-value>)',
          '700': 'rgb(var(--color-gray-700) / <alpha-value>)',
          '800': 'rgb(var(--color-gray-800) / <alpha-value>)',
          '900': 'rgb(var(--color-gray-900) / <alpha-value>)',
          '950': 'rgb(var(--color-gray-950) / <alpha-value>)',
        },
        accent: "var(--ghost-accent-color)",
        "accent-5": "rgb(var(--ghost-accent-color-rgb) / 0.05)",
        "accent-10": "rgb(var(--ghost-accent-color-rgb) / 0.1)",
        "accent-20": "rgb(var(--ghost-accent-color-rgb) / 0.2)",
        "accent-contrast": "var(--color-contrast, #fff)",
      },
      spacing: {
        "outer": "1.25rem",
        "outer-xl": "2.5rem",
      },
      screens: {
        "2xl": "1366px",
        "3xl": "1440px",
        "4xl": "1536px",
        "6xl": "1920px",
      },
      fontSize: {
        "xs": ['0.8125rem', '1.125rem'],
        "2xs": ['0.75rem', '1rem'],
        "lead": ['1.375rem', '2rem'],
      },
      letterSpacing: {
        "xs": "0.012em",
        negative: {
          "xs": "-0.012em"
        }
      },
      textDecorationThickness: {
        "3": "3px",
      },
      textUnderlineOffset: {
        "3": "3px",
      },
      opacity: {
        "85": "0.85",
      },
      minHeight: {
        "10": "2.5rem",
        "20": "5rem",
      },
      minWidth: {
        "logo": "min(calc(var(--logo-width) * 1px), calc(36px * var(--logo-width) / var(--logo-height)))",
      }, 
      keyframes: {
        "slide-up": {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        "slide-down": {
          '0%': { opacity: 0, transform: 'translateY(-40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slide-up var(--animation-duration, 0ms) ease-out',
        'slide-down': 'slide-down var(--animation-duration, 0ms) ease-out',
      },              
    }
  },
}


