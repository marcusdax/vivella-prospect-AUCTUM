/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        parchment: '#F5F0EB',
        'root-earth': '#5C3D2E',
        'neural-amber': '#D4A24A',
        'dawn-rose': '#E8B4B4',
        'flourish-green': '#7A8B6F',
        'deep-bark': '#3D2B1F',
        'warm-stone': '#C4B5A5',
        'soft-mist': '#E8E2DB',
      },
      fontFamily: {
        sans: ['GeistSans', 'system-ui', 'sans-serif'],
        serif: ['SourceSerif4', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
