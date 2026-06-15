// Builder.io editor registration (insert menus + design tokens).
// These export functions/data only — no import-time side effects.
export * from './builder-registry';
export * from './builder-design-tokens';

// Client-only entry point that registers everything for the Builder editor.
export { registerBuilderEditor } from './registerBuilderEditor';

// New modular registration system
export * from './registration';

// Registry exports
export * from './registry';

// Component exports
export * from './components/common/ThemeProvider';
export * from './components/ui/Accordion';
export * from './components/ui/Alert';
export * from './components/ui/Button';
export * from './components/ui/DesignKitOverview';
export * from './components/ui/Headline';
export * from './components/ui/NotFoundContent';

export * from './components/cta/CardImageCTA';
export * from './components/cta/TileCTA';
export * from './components/cta/TileContent';
export * from './components/cta/TileImage';
export * from './components/cta/TileQuote';

export * from './components/layout/Banner100';
export * from './components/layout/Carousel';
export * from './components/layout/Tabs';

export * from './components/navigation/DefaultFooter';
export * from './components/navigation/DefaultHeader';
export * from './components/navigation/Footer';
export * from './components/navigation/Header';
export * from './components/navigation/CenterLogoHeader';
export * from './components/navigation/VerticalNavigation';

export * from './components/seo';

// Context exports
export * from './contexts/SiteContextProvider';
export * from './contexts/ThemeContext';

// Hook exports
export * from './hooks/useTheme';

// Utility exports
export * from './utils';