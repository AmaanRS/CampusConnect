/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          extralight: "#F4F6FB",
          light: "#7194F5",
          lightone: "#9EC2FB",
          dark: "#243DDE",
        },
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.85, 0, 0.15, 1)",
      },
      backgroundImage: {
        mainbg: "url('src/utils/bgcolor.webp')",
      },
    },
  },
  plugins: [],
};
