"use client";

import React, { ReactNode } from "react";
import { ThemeContextProvider } from "../../../contexts/ThemeContext";
import { useResolvedTheme } from "../../../hooks/useTheme";
import { Theme } from "@repo/types";

interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
  inheritTheme?: boolean;
  className?: string;
}

/**
 * ThemeProvider component that applies theme context and CSS data attributes
 *
 * This component:
 * 1. Resolves the theme based on inheritance rules
 * 2. Sets the data-theme attribute for CSS custom properties
 * 3. Applies theme-aware CSS classes
 * 4. Provides theme context to child components
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme,
  inheritTheme = false,
  className = "",
}) => {
  const resolvedTheme = useResolvedTheme(theme, inheritTheme);
  
  return (
    <ThemeContextProvider theme={resolvedTheme} parentTheme={theme}>
      <div 
        data-theme={resolvedTheme}
        className={`bg-theme-bg text-theme-text transition-colors duration-200 ${className}`}
      >
        {children}
      </div>
    </ThemeContextProvider>
  );
};

export default ThemeProvider;
