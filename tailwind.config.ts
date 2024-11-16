const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette").default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false, // Disable Tailwind's dark mode
  content: [
    "./src/**/*.{ts,tsx}", // Paths to your component files
    "./node_modules/@shadcn/ui/**/*.{ts,tsx}", // Make sure ShadCN UI components are included
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans], // Replace "Inter" with your font if different
      },
      colors: {
        ...colors, // Use default Tailwind colors
      },
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`, // Custom box shadow
      },
    },
  },
  plugins: [
    addVariablesForColors, // Adding custom CSS variables
  ],
};

// Function to add custom CSS variables for colors
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars, // Create root CSS variables for colors
  });
}
