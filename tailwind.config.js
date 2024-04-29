/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: '#d18f4f',
        lightgrey: '#828282',
        primary: '#1C191A',
        secondary: '#F5E6D7',
        third: '#F14902',
      },
      screens: {
        'custom-min': {
          min: '900px',
        },
        'custom-max': {
          max: '900px',
        },
        'custom-500': {
          max: '500px',
        },
      },
    },
  },
  plugins: [],
};
