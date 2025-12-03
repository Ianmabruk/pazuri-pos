export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        lg: "2rem",
        xl: "2rem",
        "2xl": "3rem",
      },
    },
    extend: {
      colors: {
        primary: "#1D4ED8",
        primaryLight: "#38BDF8",
        accent: "#FB923C",
        ink: "#0f172a",
        muted: "#64748b",
        success: "#16a34a",
        warning: "#f59e0b",
        danger: "#dc2626",
      },
      fontFamily: {
        inter: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 25px -10px rgba(2, 6, 23, 0.15)",
        card: "0 12px 30px -12px rgba(2, 6, 23, 0.20)",
      },
      borderRadius: {
        xl: "1rem",
      },
      backgroundImage: {
        grid:
          "linear-gradient(to right, rgba(2,6,23,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(2,6,23,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "20px 20px, 20px 20px",
      },
    },
  },
  plugins: [],
};
