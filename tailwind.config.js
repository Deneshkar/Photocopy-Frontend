/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f8fbfd",
          100: "#f0f6fb",
          200: "#ddeaf5",
          300: "#c4dcee",
          400: "#aacde0",
          500: "#8fbfd7",
          600: "#6aadcd",
          700: "#4a94b8",
          800: "#326080",
          900: "#1a3a52",
        },
        dark: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        paper: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
        },
        mint: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#2dd4bf",
          500: "#14b8a6",
        },
      },
      boxShadow: {
        soft: "0 8px 30px rgba(16, 24, 40, 0.08)",
        card: "0 1px 2px rgba(16, 24, 40, 0.08), 0 12px 24px rgba(16, 24, 40, 0.08)",
      },
      fontFamily: {
        sans: ["Manrope", "Segoe UI", "Tahoma", "sans-serif"],
        display: ["Sora", "Manrope", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
    },
  },
  plugins: [],
}

