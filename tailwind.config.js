/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"]
      },
      colors: {
        primary: {
          DEFAULT: "#6C63FF",
          50:  "#F0EFFF",
          100: "#E2E0FF",
          200: "#C5C1FF",
          300: "#A8A2FF",
          400: "#8B83FF",
          500: "#6C63FF",
          600: "#4D43FF",
          700: "#2E23FF",
          800: "#1A10E0",
          900: "#120BB0"
        },
        accent: {
          DEFAULT: "#00D4AA",
          50:  "#E0FFF9",
          100: "#B3FFF0",
          200: "#66FFE1",
          300: "#1AFFD2",
          400: "#00EEC0",
          500: "#00D4AA",
          600: "#00AA88",
          700: "#008066",
          800: "#005544",
          900: "#002B22"
        },
        surface: {
          DEFAULT: "#1A1A2E",
          50:  "#F2F2F8",
          100: "#D8D8EE",
          200: "#B0B0DC",
          300: "#8888CB",
          400: "#5555A8",
          500: "#2E2E5A",
          600: "#1A1A2E",
          700: "#131326",
          800: "#0D0D1E",
          900: "#070710"
        },
        base: {
          DEFAULT: "#0A0A0F",
          50:  "#ECECF0",
          100: "#C8C8D1",
          200: "#9595A3",
          300: "#626275",
          400: "#3D3D50",
          500: "#1A1A2E",
          600: "#121218",
          700: "#0A0A0F",
          800: "#050508",
          900: "#020203"
        }
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
        "gradient-surface": "linear-gradient(180deg, #1A1A2E 0%, #0A0A0F 100%)"
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(108, 99, 255, 0.35)",
        "glow-accent":  "0 0 20px rgba(0, 212, 170, 0.35)"
      },
      borderRadius: {
        xl2: "1rem",
        xl3: "1.5rem"
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};