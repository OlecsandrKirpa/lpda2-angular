import type { Config } from 'tailwindcss'

export default {
  prefix: ``,
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--first-color)",
        secondary: "var(--second-color)",
        
        // https://tailwindcss.com/docs/customizing-colors
        success: "#22c55e", // green-500
        "success-dark": "#15803d", // green-700
        warning: "#eab308", // yellow-500
        danger: "#ef4444", // red-500
        info: "#3b82f6", // blue-500
        // secondary: "#6b7280", // gray-500
      },
    },
  },
  plugins: [],
} satisfies Config

