// Stateless function to determine if a locale redirect is needed
export interface LocaleRedirectOptions {
  pathname: string;
  preferredLanguage?: string;
  supportedLocales?: string[];
  defaultLocale?: string;
}

export function getLocaleRedirectPath({
  pathname,
  preferredLanguage,
  supportedLocales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'],  
  defaultLocale = 'en',
}: LocaleRedirectOptions): string | null {
  // Guard: pathname must be a non-empty string
  if (!pathname || typeof pathname !== 'string') {
    return null;
  }

  // Special handling for root path
  if (pathname === '/') {
    if (
      preferredLanguage &&
      preferredLanguage !== defaultLocale &&
      supportedLocales.includes(preferredLanguage)
    ) {
      return `/${preferredLanguage}`;
    }
    return null;
  }

  // Guard: preferredLanguage must be a non-empty string and in supportedLocales
  if (!preferredLanguage || !supportedLocales.includes(preferredLanguage)) {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);
  const possibleLocale = segments[0];

  // If URL already has the preferred locale, no redirect needed
  if (possibleLocale === preferredLanguage) {
    return null;
  }

  // If current path has a different locale, replace it
  if (supportedLocales.includes(possibleLocale)) {
    const pathWithoutLocale = '/' + segments.slice(1).join('/');
    if (preferredLanguage !== defaultLocale) {
      return `/${preferredLanguage}${pathWithoutLocale}`;
    }
    // If preferred is default locale, redirect to path without locale
    return pathWithoutLocale || '/';
  }

  // If no locale in path and preferred is not default, add preferred locale
  if (
    preferredLanguage &&
    preferredLanguage !== defaultLocale &&
    supportedLocales.includes(preferredLanguage)
  ) {
    return `/${preferredLanguage}${pathname}`;
  }
  
  return null;
}

/**
 * Extract locale from pathname
 */
export function getLocaleFromPathname(
  pathname: string, 
  supportedLocales: string[] = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh']
): string | null {
  const segments = pathname.split('/').filter(Boolean);
  const possibleLocale = segments[0];
  
  return supportedLocales.includes(possibleLocale) ? possibleLocale : null;
}

/**
 * Remove locale from pathname
 */
export function removeLocaleFromPathname(
  pathname: string, 
  supportedLocales: string[] = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh']
): string {
  const segments = pathname.split('/').filter(Boolean);
  const possibleLocale = segments[0];
  
  if (supportedLocales.includes(possibleLocale)) {
    const pathWithoutLocale = '/' + segments.slice(1).join('/');
    return pathWithoutLocale === '/' ? '/' : pathWithoutLocale;
  }
  
  return pathname;
}