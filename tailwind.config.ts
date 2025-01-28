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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary_text: "#1E40AF",
        primary_button: "#1E40AF", 
        button_hover: "#1D4ED8", 
        // button_focus: "#312E81", 
        // primary_text: "#5b171e", // Very Dark Red as primary text
        // primary_button: "#7a1f29", // A slightly lighter red for buttons
        // button_hover: "#921c24", // A more vibrant dark red for hover effect
        // button_focus: "#b22222", // Firebrick red for contrast on focus
        // primary_text: "#b91c1c", // Similar to Tailwind's red-700
        // primary_button: "#dc2626", // Slightly brighter red (like red-600)
        // button_hover: "#ef4444", // Even brighter for hover (like red-500)
        // button_focus: "#991b1b", // Darker red for focused state (like red-800)
      },
    },
  },
  plugins: [],
};
export default config;
