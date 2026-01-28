module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  safelist: [
    'bg-primary-700',
    'bg-primary-800',
    'hover:bg-primary-800',
    'text-primary-700',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          700: '#0f766e',
          800: '#115e59',
        },
        beige: {
          100: '#F9F5F0',
        },
      },
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
