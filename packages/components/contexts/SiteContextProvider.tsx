"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { SiteContext } from '@repo/types';

interface SiteContextProviderProps {
  children: ReactNode;
  siteContext: SiteContext | null;
}

interface SiteContextValue {
  siteContext: SiteContext | null;
  isLoading: boolean;
}

const SiteContextContext = createContext<SiteContextValue | undefined>(undefined);

export function SiteContextProvider({ children, siteContext }: SiteContextProviderProps) {
  const value: SiteContextValue = {
    siteContext,
    isLoading: !siteContext,
  };

  return (
    <SiteContextContext.Provider value={value}>
      {children}
    </SiteContextContext.Provider>
  );
}

export function useSiteContext(): SiteContextValue {
  const context = useContext(SiteContextContext);
  if (context === undefined) {
    throw new Error('useSiteContext must be used within a SiteContextProvider');
  }
  return context;
}