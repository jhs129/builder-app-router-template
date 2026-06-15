"use client";

import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Theme } from '@repo/types';

interface UseThemeOptions {
  explicitTheme?: Theme;
  inheritTheme?: boolean;
}

interface UseThemeReturn {
  theme: Theme;
  parentTheme?: Theme;
  isInherited: boolean;
}

/**
 * Hook for consuming theme context and resolving theme inheritance
 * 
 * @param options - Configuration for theme resolution
 * @returns Resolved theme information
 */
export const useTheme = (options: UseThemeOptions = {}): UseThemeReturn => {
  const { explicitTheme, inheritTheme = false } = options;
  const context = useContext(ThemeContext);
  
  // Determine the resolved theme based on inheritance rules
  let resolvedTheme: Theme;
  let isInherited = false;
  
  if (inheritTheme && context?.theme) {
    // Use theme from context (parent component)
    resolvedTheme = context.theme;
    isInherited = true;
  } else if (explicitTheme) {
    // Use explicitly provided theme
    resolvedTheme = explicitTheme;
  } else if (context?.theme) {
    // Fall back to context theme if no explicit theme provided
    resolvedTheme = context.theme;
    isInherited = true;
  } else {
    // Final fallback to light theme
    resolvedTheme = 'light';
  }
  
  return {
    theme: resolvedTheme,
    parentTheme: context?.parentTheme,
    isInherited,
  };
};

/**
 * Simplified hook that directly returns a resolved theme string
 * 
 * @param explicitTheme - Optional explicit theme to use
 * @param inheritTheme - Whether to inherit from parent context
 * @returns The resolved theme string
 */
export const useResolvedTheme = (
  explicitTheme?: Theme,
  inheritTheme = false
): Theme => {
  const { theme } = useTheme({ explicitTheme, inheritTheme });
  return theme;
};