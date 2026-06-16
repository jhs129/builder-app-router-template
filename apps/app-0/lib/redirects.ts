import { fetchEntries } from "@builder.io/sdk-react";
import type { UrlRedirect } from "@repo/types";

// The Builder model seeded by scripts/seed-builder.mjs. Editors manage redirect
// rules there; this module reads them at build time (see next.config.ts).
const URL_REDIRECT_MODEL = "url-redirect";

// Minimal shape of a Next.js redirect object (next.config `redirects()`).
interface NextRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

// Fetches every redirect rule from the `url-redirect` model and maps it to the
// shape Next.js expects. `urlFrom`/`urlTo` are passed through verbatim, so Next
// path syntax like `/old/:slug*` works. `permanentRedirect` selects 308 vs 307.
//
// This runs at BUILD TIME only — changes in Builder.io take effect on the next
// deploy. That keeps redirects fast (handled by Next/the CDN, no per-request
// fetch) and is the right trade-off for most sites. If a project outgrows
// Next's ~1,024-redirect limit or needs per-domain rules, graduate to a
// middleware/proxy that reads a generated JSON file at request time.
export async function getBuilderRedirects(): Promise<NextRedirect[]> {
  const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
  if (!apiKey) return [];

  try {
    const entries = await fetchEntries({
      model: URL_REDIRECT_MODEL,
      apiKey,
      options: { noTargeting: true },
      // Builder paginates with a small default page size; raise the limit so a
      // large redirect set isn't silently truncated.
      limit: 200,
    });

    // Collapse every entry's `redirects` list into one flat array, keeping the
    // first rule seen for any given source path.
    const seen = new Set<string>();
    const redirects: NextRedirect[] = [];
    for (const entry of entries ?? []) {
      const rules = (entry?.data?.redirects ?? []) as UrlRedirect[];
      for (const rule of rules) {
        if (!rule?.urlFrom || !rule?.urlTo || seen.has(rule.urlFrom)) continue;
        seen.add(rule.urlFrom);
        redirects.push({
          source: rule.urlFrom,
          destination: rule.urlTo,
          permanent: rule.permanentRedirect ?? true,
        });
      }
    }
    return redirects;
  } catch (error) {
    // Never fail the build over a redirect fetch — log and ship zero redirects.
    console.error("Failed to load url-redirect entries from Builder.io:", error);
    return [];
  }
}
