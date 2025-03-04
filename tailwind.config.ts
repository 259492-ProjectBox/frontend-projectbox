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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          light: '#60A5FA',    // Light blue for subtle highlights
          DEFAULT: '#2563EB',  // Main blue for primary actions
          dark: '#1E40AF',     // Dark blue for text and hover states
          hover: '#1D4ED8',    // Specific hover state color
          focus: '#1E3A8A',    // Deep blue for focus states
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
      },
    },
  },
  plugins: [],
};
export default config;
