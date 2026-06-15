const sharedTheme = require("../../packages/components/tailwind-theme.json");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
    // Scope the package globs to source dirs only. A bare
    // `../../packages/components/**` also matches that package's own
    // pnpm `node_modules`, whose huge tree slows the CSS scan.
    "../../packages/components/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/components/components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/components/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/components/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/components/registration/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/components/registry/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/components/utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Ensure all background color classes for design kit are included
    "bg-primary-white",
    "bg-primary-light",
    "bg-secondary-light",
    "bg-primary-dark",
    "bg-secondary-dark",
    "bg-primary-accent",
    "bg-secondary-accent",
    "bg-accent-green",
    "bg-accent-purple",
    "bg-accent-magenta",
    "bg-accent-cyan",
    "bg-accent-teal",
    "bg-accent-light-purple",

    
    // Theme-aware color classes
    "bg-theme-bg",
    "bg-theme-bg-alt",
    "text-theme-text",
    "text-theme-text-alt",
    "text-theme-heading",
    "text-theme-heading-alt",
    "text-theme-text-alt",
    "text-theme-text-muted",
    "text-theme-link",
    "hover:text-theme-link-hover",
    "bg-theme-btn-bg",
    "text-theme-btn-text",
    "hover:bg-theme-btn-hover-bg",
    "hover:text-theme-btn-hover-text",
    "text-theme-btn-outlined-text",
    "border-theme-btn-outlined-border",
    "hover:bg-theme-btn-outlined-hover-bg",
    "hover:text-theme-btn-outlined-hover-text",
    "outline-theme-focus",
    
    // Alignment classes for components
    "items-start",
    "items-center", 
    "items-end",
    "text-left",
    "text-center",
    "text-right",
  ],
  theme: {
    extend: {
      ...sharedTheme,
    },
  },
  plugins: [],
};