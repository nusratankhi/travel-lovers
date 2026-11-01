import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1F4D",
          "navy-light": "#142E63",
          pink: "#F20D65",
          "pink-light": "#FF3D86",
          bg: "#F6F8FC",
          "light-blue": "#EAF1FF",
          "text-dark": "#152443",
          "text-secondary": "#68758D",
          success: "#16A36A",
          warning: "#F59E0B",
          danger: "#E5484D",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
