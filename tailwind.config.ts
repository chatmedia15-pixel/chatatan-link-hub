import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#152C46",
        "blue-gray": "#B8C9DC",
        "text-dark": "#172033",
        muted: "#6B7280",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        hub: "520px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 28px rgba(0,0,0,0.14)",
      },
    },
  },
  plugins: [],
};
export default config;
