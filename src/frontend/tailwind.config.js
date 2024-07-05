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
          medium: "#4667EB",
        },
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.12, 0, 0.39, 0)",
      },

      fontFamily: {
        openSans: "Montserrat , sans-serif",
      },

      keyframes: {
        "shift-up": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-3px)" },
        },
        "shift-down": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-2px)" },
        },
      },
      animation: {
        "shift-up": "shift-up 0.3s ease-out forwards",
        "shift-down": "shift-down 0.1s ease-out forwards",
      },
      variants: {
        extend: {
          animation: ["hover", "active"],
        },
      },
    },
  },
  plugins: [],
};
