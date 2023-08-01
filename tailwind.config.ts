import type { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{tsx,ts}"
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",

      black: "#0C0E11",
      light: "#E6E6E6",
      blueDark: "#0F172A",

      gray: {
        100: "#BCBCBC",
        200: "#a9a9a9",
        300: "#989898",
        400: "#898989",
        500: "#7b7b7b",
        600: "#6f6f6f",
        700: "#646464",
        800: "#5a5a5a",
        900: "#515151"
      },

      blue: {
        100: "#0F172A",
        200: "#0e1526",
        300: "#0d1322",
        400: "#0c111f",
        500: "#0b0f1c",
        600: "#0a0e19",
        700: "#090d17",
        800: "#080c15",
        900: "#070b13"
      }
    },

    borderRadius: {
      DEFAULT: "0.375rem",
      md: "0.5rem",
      full: "9999px"
    },

    container: {
      center: true,
      padding: "2rem"
    }
  },
  plugins: []
} satisfies Config;