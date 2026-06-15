"use client";

import React, { createContext, ReactNode } from 'react';
import { Theme } from '@repo/types';

interface ThemeContextValue {
  theme: Theme;
  setTheme?: (theme: Theme) => void;
  parentTheme?: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeContextProviderProps {
  children: ReactNode;
  theme: Theme;
  parentTheme?: Theme;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({
  children,
  theme,
  parentTheme,
}) => {
  return (
    <ThemeContext.Provider value={{ theme, parentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };