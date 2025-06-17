import type { Config } from 'tailwindcss';
import scrollbar from 'tailwind-scrollbar';
const config: Config = {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B0C10",
        card: "#1F2833",
        text: "#C5C6C7",
        cyan: "#66FCF1",
        teal: "#45A29E",
      },
    },
  },
  plugins: [scrollbar],
};

export default config;
