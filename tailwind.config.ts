import type { Config } from 'tailwindcss'

export default {
  prefix: `tw-`,
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config

