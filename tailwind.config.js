/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    colors: {
      "blue-primary": "#2F2F66",
      "blue-secondary": "#43438B",
      "magenta": "#DA4BDD",
      "green": "#1FA342",
      "red": "#D93A4A",
      "white": "#FFFFFF",
      "gray-100": "#F9FBF9",
      "gray-200": "#EFF0EF",
      "gray-300": "#E5E6E5",
      "gray-400": "#A1A2A1",
      "gray-500": "#676767",
      "gray-600": "#494A49",
      "gray-700": "#0F0F0F",
      "black": "#000000",
    },
    fontFamily: {
      sans: ["Lato", "sans-serif"],
    },
  },
};
export const plugins = [];

