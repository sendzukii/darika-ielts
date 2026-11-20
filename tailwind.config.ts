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
        sakura: {
          100: '#fff0f5',
          300: '#ffb7c5',
          500: '#ff8da1',
          700: '#c9184a',
        },
        midnight: '#0a0a0a',
      },
    },
  },
  plugins: [],
};
export default config;
