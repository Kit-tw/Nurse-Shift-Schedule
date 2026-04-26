// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // The core "Nurse" branding
        medical: {
          50:  "#f0f7ff", // Background tint
          100: "#e0effe",
          500: "#0ea5e9", // Primary Action
          600: "#0284c7", // Hover states
          700: "#0369a1", // Deep professional blue
          900: "#0c4a6e", // Headers/Text
        },
        // Scheduling status colors
        status: {
          available: "#10b981", // Emerald 500
          pending:   "#f59e0b", // Amber 500
          busy:      "#ef4444", // Red 500
          night:     "#6366f1", // Indigo 500 (Night shifts)
        },
        // Neutral palette for a clean clinical look
        surface: {
          ground: "#f8fafc", // Main app background
          card:   "#ffffff", // Content containers
          border: "#e2e8f0", // Subtle dividers
        }
      },
    },
  },
  plugins: [],
};

export default config;