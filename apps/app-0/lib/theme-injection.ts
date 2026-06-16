// Theme injection utilities for Builder.io preview environment

// Theme CSS content that will be injected into Builder.io preview
const THEME_CSS = `
/* Theme CSS for Builder.io Preview Environment */
/* Base theme-aware CSS custom properties */
:root {
  /* Brand Color Variables — Chameleon Collective palette */
  --primary-dark: #121212;
  --primary-light: #ffffff;
  --primary-parchment: #eae4c8;
  --secondary-light: #f3f3f3;
  --secondary-dark: #5b5b5b;
  --accent-purple: #ea633f;
  --accent-green: #e8eb74;
  --accent-magenta: #f78d1e;
  --accent-cyan: #88e8f0;
  --accent-teal: #0097a7;
  --accent-light-purple: #ced167;
  --primary-cyan: #88e8f0;
  --primary-accent: #ea633f;

  /* Default Theme-aware Properties — Parchment canvas (CC default page bg) */
  --theme-bg: var(--primary-parchment);
  --theme-text: var(--primary-dark);
  --theme-heading: var(--primary-dark);
  --theme-heading-alt: var(--accent-purple);
  --theme-text-muted: var(--secondary-dark);
  --theme-link: var(--accent-purple);
  --theme-link-hover: var(--accent-purple);
  --theme-focus: var(--accent-purple);
  --theme-underline: var(--accent-purple);
}

/* Light Theme */
[data-theme="light"],
[data-theme] [data-theme="light"] {
  --theme-bg: var(--primary-light);
  --theme-bg-alt: var(--primary-dark);
  --theme-text: var(--primary-dark);
  --theme-text-alt: var(--accent-purple);
  --theme-heading: var(--primary-dark);
  --theme-heading-alt: var(--accent-purple);
  --theme-text-muted: var(--secondary-dark);
  --theme-link: var(--accent-purple);
  --theme-link-hover: var(--accent-purple);
  --theme-btn-text: var(--primary-light);
}

/* Dark Theme */
[data-theme="dark"],
[data-theme] [data-theme="dark"] {
  --theme-bg: var(--primary-dark);
  --theme-bg-alt: var(--primary-light);
  --theme-text: var(--primary-light);
  --theme-text-alt: var(--accent-cyan);
  --theme-heading: var(--primary-light);
  --theme-heading-alt: var(--accent-cyan);
  --theme-text-muted: var(--secondary-light);
  --theme-link: var(--accent-cyan);
  --theme-link-hover: var(--accent-cyan);
  --theme-btn-text: var(--primary-dark);
}

/* Accent Theme */
[data-theme="accent"],
[data-theme] [data-theme="accent"] {
  --theme-bg: var(--accent-cyan);
  --theme-bg-alt: var(--primary-dark);
  --theme-text: var(--primary-dark);
  --theme-text-alt: var(--primary-light);
  --theme-heading: var(--primary-dark);
  --theme-heading-alt: var(--primary-light);
  --theme-text-muted: var(--secondary-dark);
  --theme-link: var(--primary-light);
  --theme-link-hover: var(--primary-light);
  --theme-btn-text: var(--primary-dark);
}

/* Gradient Theme */
[data-theme="gradient"],
[data-theme] [data-theme="gradient"] {
  --theme-bg: linear-gradient(135deg, var(--accent-magenta) 0%, var(--accent-green) 100%);
  --theme-bg-alt: var(--primary-light);
  --theme-text: var(--primary-light);
  --theme-text-alt: var(--accent-cyan);
  --theme-heading: var(--primary-light);
  --theme-heading-alt: var(--accent-cyan);
  --theme-text-muted: var(--secondary-light);
  --theme-link: var(--accent-cyan);
  --theme-link-hover: var(--accent-cyan);
  --theme-btn-text: var(--primary-dark);
}

/* Transparent Light Theme */
[data-theme="transparent-light"],
[data-theme] [data-theme="transparent-light"] {
  --theme-bg: transparent;
  --theme-bg-alt: var(--primary-light);
  --theme-text: var(--primary-dark);
  --theme-text-alt: var(--accent-purple);
  --theme-heading: var(--primary-dark);
  --theme-heading-alt: var(--accent-purple);
  --theme-text-muted: var(--secondary-dark);
  --theme-link: var(--accent-purple);
  --theme-link-hover: var(--accent-purple);
  --theme-btn-text: var(--primary-light);
}

/* Transparent Dark Theme */
[data-theme="transparent-dark"],
[data-theme] [data-theme="transparent-dark"] {
  --theme-bg: transparent;
  --theme-bg-alt: var(--primary-dark);
  --theme-text: var(--primary-light);
  --theme-text-alt: var(--accent-cyan);
  --theme-heading: var(--primary-light);
  --theme-heading-alt: var(--accent-cyan);
  --theme-text-muted: var(--secondary-light);
  --theme-link: var(--accent-cyan);
  --theme-link-hover: var(--accent-cyan);
  --theme-btn-text: var(--primary-dark);
}
`;

/**
 * Injects theme CSS into Builder.io's preview environment
 * This ensures that theme-aware components render correctly in the Builder.io editor
 */
export function injectThemeStyles() {
  if (typeof window !== 'undefined') {
    // Check if styles are already injected
    if (document.getElementById('app-theme-styles')) {
      return;
    }

    // Create and inject style element
    const styleElement = document.createElement('style');
    styleElement.id = 'app-theme-styles';
    styleElement.textContent = THEME_CSS;
    document.head.appendChild(styleElement);
  }
}

/**
 * Register theme injection with Builder.io
 * This ensures themes are available in the Builder.io preview environment
 */
export function registerThemeInjection() {
  // Inject styles immediately
  injectThemeStyles();

  // Also inject when Builder.io preview loads
  if (typeof window !== 'undefined' && (window as any).parent !== window) {
    // We're in an iframe (likely Builder.io preview)
    const checkAndInject = () => {
      if (!document.getElementById('app-theme-styles')) {
        injectThemeStyles();
      }
    };

    // Inject on load and DOM changes
    document.addEventListener('DOMContentLoaded', checkAndInject);
    if (document.readyState === 'loading') {
      checkAndInject();
    }

    // Use MutationObserver to handle dynamic content
    const observer = new MutationObserver(() => {
      if (!document.getElementById('app-theme-styles')) {
        injectThemeStyles();
      }
    });

    observer.observe(document.head, { childList: true });
  }
}