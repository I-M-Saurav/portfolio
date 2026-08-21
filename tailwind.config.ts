import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      colors: {
        background: {
          DEFAULT: "#0a0a0e",
          light: "#f4f4f0",
          dark: "#0a0a0e",
        },
        surface: {
          light: "#ffffff",
          dark: "#121218",
          cardLight: "#ffffff",
          cardDark: "#111116",
        },
        foreground: {
          DEFAULT: "#f4f4f5",
          light: "#18181b",
          dark: "#f4f4f5",
        },
        muted: {
          light: "#71717a",
          dark: "#a1a1aa",
        },
        border: {
          light: "rgba(0, 0, 0, 0.1)",
          dark: "rgba(255, 255, 255, 0.1)",
        },
        accent: {
          DEFAULT: "#10b981", // Emerald terminal accent
          hover: "#059669",
          cyan: "#06b6d4",
          amber: "#f59e0b",
        },
      },
      animation: {
        "cursor-blink": "blink 1s step-start infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
