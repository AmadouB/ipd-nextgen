import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1440px" } },
    extend: {
      colors: {
        // Palette officielle IPD §6.1
        brand: {
          pasteur: "#0089D0",
          nuit: "#052A62",
          clair: "#86B4DD",
          noir: "#000000",
        },
        neutral: {
          surface: "#F2F3F5",
          border: "#D7D8DB",
          white: "#FFFFFF",
        },
        feedback: {
          success: "#1BA572",
          warning: "#F2B33D",
          danger: "#E5484D",
          info: "#0089D0",
        },
        // Dark mode §7.5
        ink: {
          bg: "#0A1530",
          surface: "#13234A",
          surface2: "#1A2C5E",
          border: "#1E3260",
          text: "#F2F3F5",
          muted: "#86B4DD",
        },
        // shadcn semantic
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      fontFamily: {
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        sans: ["var(--font-lato)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        // Gradients §6.3
        "gradient-hero": "linear-gradient(135deg, #052A62 0%, #0089D0 100%)",
        "gradient-kpi": "linear-gradient(90deg, #0089D0 0%, #86B4DD 100%)",
        "gradient-alert": "linear-gradient(135deg, #E5484D 0%, #7F1D1D 100%)",
        "gradient-success": "linear-gradient(135deg, #1BA572 0%, #0E5C40 100%)",
        "gradient-ink": "linear-gradient(180deg, #0A1530 0%, #052A62 100%)",
      },
      boxShadow: {
        "glow-brand": "0 0 24px rgba(0,137,208,0.25)",
        "glow-danger": "0 0 24px rgba(229,72,77,0.30)",
        "glow-success": "0 0 16px rgba(27,165,114,0.25)",
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 12px rgba(0,0,0,0.08)",
        lg: "0 12px 32px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
        xl: "20px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-danger": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(229,72,77,0.6)" },
          "50%": { boxShadow: "0 0 0 12px rgba(229,72,77,0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-danger": "pulse-danger 2s ease-out 2",
        shimmer: "shimmer 1.6s infinite",
        "count-up": "count-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
