/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#FAFAFA",
          200: "#F5F5FC",
          300: "#EFF1F7",
          400: "#D3D6E1",
          500: "#E4E7EB",
          600: "#808695",
          700: "#666666",
          800: "#999999",
          900: "#333",
        },
        blue: {
          200: "#EEEEFF",
          300: "#E0E4FC",
          500: "#E3E0FF",
          600: "#7182FF",
          700: "#4A3AFF",
          800: "#303775",
          900: "#202452",
        },
        black: {
          300: "#90939D",
          400: "rgb(0,0,0,0.25)",
          500: "#20232B",
          600: "#1E1F25",
          700: "#20232B",
          800: "#131517",
          900: "#000000",
        },
        sky: {
          500: "#3E97FF",
        },
        yellow: {
          300: "#FEF7D0",
          500: "#FAD614",
        },
        red: {
          200: "#E8CEE3",
        },
      },
    },
  },
  plugins: [],
};
