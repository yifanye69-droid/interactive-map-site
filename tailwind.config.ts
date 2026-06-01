import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cartoon: ["var(--font-cartoon)", "PingFang SC", "sans-serif"],
        display: ["var(--font-cartoon)", "system-ui", "sans-serif"],
        body: ["var(--font-cartoon)", "system-ui", "sans-serif"],
      },
      colors: {
        festival: {
          sky: "#a8d8f0",
          cream: "#fff8e7",
          coral: "#ff6b8a",
          mint: "#5ec9a0",
          gold: "#f5c842",
        },
      },
      boxShadow: {
        card: "0 12px 40px rgba(0, 60, 80, 0.18), 0 2px 8px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
