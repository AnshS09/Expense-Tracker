/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-secondary-container": "#54647a",
        "on-secondary-fixed-variant": "#38485d",
        "surface-container": "#eceef0",
        "on-surface": "#191c1e",
        "on-primary-fixed": "#131b2e",
        "secondary-container": "#d0e1fb",
        "outline-variant": "#c6c6cd",
        "on-tertiary-fixed-variant": "#574425",
        "surface-bright": "#f7f9fb",
        "surface-variant": "#e0e3e5",
        "error": "#ba1a1a",
        "on-primary": "#ffffff",
        "tertiary-container": "#271901",
        "inverse-primary": "#bec6e0",
        "error-container": "#ffdad6",
        "surface-container-highest": "#e0e3e5",
        "primary": "#0f172a",
        "on-surface-variant": "#45464d",
        "on-primary-fixed-variant": "#3f465c",
        "on-secondary-fixed": "#0b1c30",
        "on-secondary": "#ffffff",
        "primary-fixed": "#dae2fd",
        "surface-container-low": "#f2f4f6",
        "surface": "#f7f9fb",
        "primary-fixed-dim": "#bec6e0",
        "tertiary-fixed": "#fcdeb5",
        "surface-container-lowest": "#ffffff",
        "surface-dim": "#d8dadc",
        "on-tertiary-container": "#98805d",
        "secondary-fixed": "#d3e4fe",
        "inverse-surface": "#2d3133",
        "on-error-container": "#93000a",
        "on-background": "#191c1e",
        "on-tertiary": "#ffffff",
        "background": "#f7f9fb",
        "tertiary-fixed-dim": "#dec29a",
        "on-tertiary-fixed": "#271901",
        "surface-tint": "#565e74",
        "primary-container": "#131b2e",
        "tertiary": "#000000",
        "surface-container-high": "#e6e8ea",
        "on-primary-container": "#7c839b",
        "inverse-on-surface": "#eff1f3",
        "on-error": "#ffffff",
        "secondary": "#505f76",
        "outline": "#76777d",
        "secondary-fixed-dim": "#b7c8e1",
        // Semantic cash flow indicators
        "success": "#10b981",
        "expense": "#ef4444",
        "transfer": "#3b82f6",
        "warning": "#f59e0b",

        // Dark Mode Slate Extensions
        dark: {
          bg: "#0b0f17",
          card: "#151c28",
          border: "#1e293b",
          text: "#f8fafc",
          subtext: "#94a3b8"
        }
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      spacing: {
        "sm": "8px",
        "gutter": "16px",
        "xl": "32px",
        "md": "16px",
        "lg": "24px",
        "xs": "4px",
        "base": "4px",
        "container-max": "1200px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        headline: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
