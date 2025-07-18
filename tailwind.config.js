/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        inda: {
          white: "#FAFAFA",
          teal: "#54A6A6",
          gray: "#EAEAEA",
          light: "#F7FAFC",
          yellow: "#F3F1A0",
          dark: "#151A1E",
        },
      },
    },
  },
  plugins: [],
};
