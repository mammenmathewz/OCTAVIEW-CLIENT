const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette").default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false, // Ensuring dark mode is disabled for the light theme
  content: [
    "./src/**/*.{ts,tsx}", // Paths to your component files
    "./node_modules/@shadcn/ui/**/*.{ts,tsx}", // Ensure ShadCN UI components are included
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans], // Use Inter font for the sans-serif stack
      },
      colors: {
        // Add or adjust the color palette to match the light theme from ShadCN UI
        primary: colors.blue, // Example: Primary color could be a blue shade
        neutral: colors.gray, // Neutral colors, you can customize as per ShadCN light theme
        accent: colors.indigo, // Example: Accent color
        // You can add more colors here if needed
      },
      boxShadow: {
        input: '0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)' // Custom input box shadow
      },
      borderRadius: {
        lg: 'var(--radius)', // You can adjust these radius values if needed
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    addVariablesForColors, // Adding custom CSS variables for colors
    require("tailwindcss-animate") // For animations
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
