import { getLocaleFromPathname } from "@repo/components/utils";

export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LOCALES = ["en", "es"];

// Resolve the locale + Builder urlPath from the catch-all route segments.
// English lives at the root (/about); Spanish is prefixed (/es/about).
export function resolvePageParams(segments: string[] | undefined): {
  locale: string;
  urlPath: string;
} {
  const parts = Array.isArray(segments) ? segments : [];
  const pathname = "/" + parts.join("/");

  const detected = getLocaleFromPathname(pathname, SUPPORTED_LOCALES);
  const locale = detected || DEFAULT_LOCALE;

  // Strip a leading locale segment to compute the Builder urlPath.
  const remaining = detected ? parts.slice(1) : parts;
  const urlPath = "/" + remaining.join("/");

  return { locale, urlPath: urlPath === "/" ? "/" : urlPath.replace(/\/$/, "") };
}

export function formatLastUpdatedDate(dateInput: unknown): string {
  if (!dateInput) return "Date not available";

  const date = new Date(dateInput as string | number);

  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Server-side preview detection from the route's searchParams.
// Builder injects builder.preview / builder.space when editing.
export function isPreviewingFromSearchParams(
  searchParams: Record<string, string | string[] | undefined> | undefined
): boolean {
  if (!searchParams) return false;
  return (
    searchParams["builder.preview"] !== undefined ||
    searchParams["builder.space"] !== undefined ||
    searchParams["builder.overrides.preview"] !== undefined
  );
}
