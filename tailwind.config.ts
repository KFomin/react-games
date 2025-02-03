import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        'customBoxShadow': '5px 3px 0px 0px cyan',
        'customBoxShadowActive': '5px 3px 0px 0px blue',
      }
    },
  },
  plugins: [],
} satisfies Config;
