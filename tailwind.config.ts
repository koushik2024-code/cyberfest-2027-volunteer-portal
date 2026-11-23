import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          darkest: "#030712",
          dark: "#080d1a",
          card: "#0d1527",
          border: "#1e293b",
          primary: "#00f0ff",
          secondary: "#38bdf8",
          accent: "#2563eb",
          neon: "#00ff9d",
          muted: "#94a3b8",
        },
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 1px, transparent 1px)",
        "cyber-radial": "radial-gradient(circle at 50% 30%, rgba(0, 240, 255, 0.12), transparent 70%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 240, 255, 0.4), 0 0 10px rgba(0, 240, 255, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 240, 255, 0.8), 0 0 30px rgba(0, 240, 255, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
