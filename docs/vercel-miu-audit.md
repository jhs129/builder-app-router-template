# Vercel MIU Audit — builder-app-router-template

**Date:** 2026-06-15
**Apps audited:** `apps/app-0` (deployed Next.js 16.2.9 App Router app). `apps/storybook` is a docs build and is excluded from MIU concerns.
**Consumption data:** Vercel MCP not authenticated in this session (the `vercel` integration exposes only an `authenticate` tool) — findings are prioritized by the skill's default leverage order (T1 → T6 → T7 → T2 → T3/T4/T5 → T8), then re-ranked by the concrete gaps found here.

## Executive summary

The app is in good shape on the structural techniques — the proxy (Next 16's `middleware.ts` replacement) carries no heavy data, there are no uncached API routes, page-level fetches are already parallelized with `Promise.all`, and fonts are self-hosted via `next/font`. The cost exposure is concentrated in **three settings that quietly multiply metered usage**:

1. **`revalidate = 5` on every dynamic route (T7)** — the single highest-leverage gap. A 5-second ISR window means busy pages and crawler traffic regenerate and rewrite the page cache up to ~12×/minute, driving ISR reads/writes, Function Invocations, and Function Duration far higher than necessary.
2. **No image optimization caching policy (T6)** — `next.config.ts` sets `remotePatterns` but no `minimumCacheTTL` and no `deviceSizes` pruning, so immutable CMS/Shopify images get re-optimized on the short default TTL and the expensive 4K (3840px) variant is generated.
3. **Sitemap has no `revalidate` (T4)** — `app/sitemap.ts` fetches from Builder on every request (Next 16 `fetch` is uncached by default), so each crawler hit is a fresh Function Invocation.

Fixing #1 and #2 is low-risk and should produce a visible drop in the Vercel Daily Consumption Breakdown.

> **Status (2026-06-15): all actionable gaps applied.** T7, T6, T4, T1, and the optional T8 dedup are implemented and verified (`pnpm build:app-0` + `pnpm lint` pass). See per-technique "applied" notes below.

## Consumption snapshot

Unavailable — Vercel MCP is not authenticated. To capture real numbers, authenticate the Vercel integration and pull the project's Daily Consumption Breakdown, then re-prioritize against the dominant line items. The plan below is ordered by code-evidenced leverage and risk.

## Findings by technique

| # | Technique | Metric(s) | apps/app-0 |
|---|---|---|---|
| T1 | Static-asset matcher exclusion | Edge MW Invocations, Edge Requests, Fast Data | ✅ Applied (was ⚠️ Partial) |
| T2 | Edge Config for big middleware data | Bundle/Duration | ✅ N/A (no heavy data) |
| T3 | Cache-Control on API success | Function Invocations | ✅ N/A (no API routes) |
| T4 | Long TTL on sitemap/feeds | Function Invocations, Edge Requests | ✅ Applied (was ❌ Gap) |
| T5 | Immutable cache on versioned assets | Edge Requests, Fast Data | ✅ N/A (`next/font`, no `public/fonts`) |
| T6 | `minimumCacheTTL` + prune `deviceSizes` | Image transforms, Fast Data | ✅ Applied (was ❌ Gap) |
| T7 | ISR `revalidate` 5 → 300 | ISR reads/writes, Invocations, Duration | ✅ Applied (was ❌ Gap) |
| T8 | Parallelize independent fetches | Function Duration | ✅ Applied dedup (was ✅ Good) |
| T9 | Preserve case for CMS routes | — (correctness) | ✅ N/A (no URL lowercasing) |

### T7 — ISR `revalidate` is `5` on all dynamic routes · ❌ Gap (do this first)
- **Evidence:**
  - `apps/app-0/app/[[...page]]/page.tsx:15` — `export const revalidate = 5;`
  - `apps/app-0/app/blogs/[handle]/page.tsx:20` — `export const revalidate = 5;`
  - `apps/app-0/app/not-found.tsx` — no `revalidate`; `notFound()` is called at `app/[[...page]]/page.tsx:129` and `app/blogs/[handle]/page.tsx:99` with no dedicated not-found window.
- **Impact:** ISR reads/writes + Function Invocations + Function Duration. A 5s window regenerates a hot page up to ~12×/minute; crawlers hitting bad URLs trigger a render + ISR write on nearly every request (a "404 storm"). Builder.io content changes do not need 5-second propagation — that's what the editor preview (`isPreviewing`) is for; published content can tolerate minutes.
- **Fix (applied 2026-06-15):** Set a literal `300` in each route.
  ```ts
  // apps/app-0/app/[[...page]]/page.tsx and app/blogs/[handle]/page.tsx
  export const revalidate = 300; // was 5
  ```
  **App Router note:** unlike Pages Router (`getStaticProps` returning `revalidate`), App Router `export const revalidate` is statically analyzed at build time and **rejects runtime/env expressions** — an env-driven value (`parseInt(process.env.…)`) fails the build with "Invalid segment configuration export detected." The value must be a literal, so per-environment tuning isn't available here; pick one production-appropriate number. Editors still get instant feedback through Builder's preview mode, which bypasses the static cache.
- **Risk:** Low. Published content propagates within 5 minutes instead of 5 seconds; preview/editing is unaffected. Verified: `pnpm build:app-0` and `pnpm lint` both pass; both routes show as `ƒ (Dynamic)` with ISR.

### T6 — No image caching policy · ✅ Applied (was ❌ Gap)
- **Evidence:** `apps/app-0/next.config.ts:11–19` — `images` sets `remotePatterns` (cdn.builder.io, cdn.shopify.com, shopify.com, images.pexels.com, placehold.co) but **no `minimumCacheTTL`**, **no `deviceSizes`** (so the default set including `3840` is used), and **no `qualities`**.
- **Impact:** Image Optimization transformations + Fast Data Transfer. Builder.io and Shopify image URLs are immutable per URL, so each optimized variant could be cached for weeks — but on the short default TTL they get re-optimized and re-transferred repeatedly. The default `deviceSizes` includes the 3840px (4K) width, which produces the largest, most expensive transform per source image.
- **Fix:**
  ```ts
  images: {
    remotePatterns: [ /* …unchanged… */ ],
    // CMS/commerce images are immutable per URL — cache optimized variants ~31 days
    minimumCacheTTL: 2678400,
    // Drop 3840 (4K): biggest transform; 4K displays fall back cleanly to 2048.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
  ```
  **Caution:** do not add a `qualities` array unless you confirm what quality the components request — in Next 15+/16 a request for a quality not in the allowlist returns HTTP 400. Since no `qualities` is set today, all qualities are allowed; left unset deliberately.
- **Risk:** Low. Worst case is a slightly stale optimized variant for an image whose URL was reused for new content (uncommon with Builder/Shopify, which version URLs).
- **Applied 2026-06-15:** `apps/app-0/next.config.ts` — added `minimumCacheTTL: 2678400` and `deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048]`. Build + lint pass.

### T4 — Sitemap has no revalidate window · ✅ Applied (was ❌ Gap)
- **Evidence:** `apps/app-0/app/sitemap.ts` — fetches `page` and `article` entries via `fetchEntries` (lines 29–42) but exports **no `revalidate`**. In Next 16, `fetch` is uncached by default, so the sitemap regenerates on every request.
- **Impact:** Function Invocations + Edge Requests. Every crawler/bot hit on `/sitemap.xml` runs two Builder fetches and regenerates the document, when a sitemap changes at most daily.
- **Fix:** Add a daily revalidate to the metadata route:
  ```ts
  // apps/app-0/app/sitemap.ts
  export const revalidate = 86400; // regenerate at most once per day
  ```
- **Risk:** Low. New URLs appear in the sitemap within a day; combine with on-demand revalidation later if faster freshness is ever needed.
- **Applied 2026-06-15:** `apps/app-0/app/sitemap.ts` — added `export const revalidate = 86400`. Build route table confirms `/sitemap.xml` → Revalidate `1d`.

### T1 — Proxy matcher does not exclude static-asset extensions · ✅ Applied (was ⚠️ Partial)
- **Evidence:** `apps/app-0/proxy.ts:40` —
  `matcher: ["/((?!api|_next/static|_next/image|favicon.ico|500).*)"]`
  The proxy body (`proxy.ts:9–28`) runs `handleErrorRedirect` and `handleDeploymentProtection` on **every** matched request, and only skips locale work for paths with a file extension (`proxy.ts:16–21`) — but the invocation itself is already billed by then.
- **Impact:** Edge Middleware Invocations (primary), Edge Requests, Fast Data. The blast radius is smaller than a typical app because Next serves built JS/CSS under `_next/static` and optimized images under `_next/image` (both already excluded), and `next/font` self-hosts fonts under `_next/static`. What still needlessly invokes the proxy: everything in `public/` (currently 5 `.svg`, `.ico`, a `.txt`), `robots.txt`, `sitemap.xml`, and any future static files. Low current volume, but it's a best-practice gap that grows silently as `public/` grows.
- **Fix:** Add a negative-lookahead for static extensions. Do **not** exclude document extensions (`.html/.pdf`) since they could be legacy redirect targets.
  ```ts
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|500|.*\\.(?:js|mjs|css|woff2?|ttf|otf|eot|png|jpe?g|gif|webp|avif|svg|ico|txt|xml|map)$).*)",
  ],
  ```
  Note: if you want the proxy to keep running for `sitemap.xml`/`robots.txt` (it currently does nothing useful for them), leave `xml`/`txt` out of the exclusion — but there's no reason to invoke it for them.
- **Risk:** Low. Verify a normal route still localizes and the `?errorCode=5xx` → `/500` redirect still fires after the change.
- **Applied 2026-06-15:** `apps/app-0/proxy.ts:40` — matcher now excludes `js|mjs|css|woff2?|ttf|otf|eot|png|jpe?g|gif|webp|avif|svg|ico|txt|xml|map` (also lets `sitemap.xml`/`robots.txt` skip the proxy, which did no useful work for them). Document extensions intentionally left in. Build + lint pass.

### T8 — Fetch parallelization · ✅ Good (one minor note)
- **Evidence:** `app/[[...page]]/page.tsx:82,115`, `app/blogs/[handle]/page.tsx:65,91`, and `app/sitemap.ts:29` all batch independent fetches with `Promise.all`/`Promise.allSettled`. No serial-await-before-batch antipattern found.
- **Minor note (not a gap):** `getSiteContext()` (`lib/builder.ts:13`) is called in `layout.tsx:44`, in each route's `generateMetadata`, and in each route's page component — up to 3 calls per request. Next.js memoizes identical `fetch` calls within a single request render, so this is likely already deduped, but to make it explicit and resilient to any cache-busting params the Builder SDK may add, wrap it in React's `cache()`:
  ```ts
  import { cache } from "react";
  export const getSiteContext = cache(async (locale = "en") => { /* … */ });
  ```
- **Risk:** Very low; pure dedup.
- **Applied 2026-06-15:** `apps/app-0/lib/builder.ts` — `getSiteContext` now wrapped in React `cache()`. Build + lint pass.

## Prioritized fix plan — ✅ all complete (2026-06-15)

1. ✅ **T7 — ISR `revalidate: 5` → `300`** (literal; App Router rejects env expressions in segment config). Both dynamic routes. Highest leverage on ISR reads/writes + Function Invocations/Duration.
2. ✅ **T6 — `minimumCacheTTL: 2678400` + pruned `deviceSizes`** in `next.config.ts`. High leverage on Image Optimization transforms + Fast Data.
3. ✅ **T4 — `export const revalidate = 86400` on `sitemap.ts`.** Removes per-request sitemap regeneration.
4. ✅ **T1 — static-extension negative-lookahead** added to the proxy matcher.
5. ✅ **T8 — `getSiteContext` wrapped in `cache()`.** Per-request fetch dedup.

All verified with `pnpm build:app-0` and `pnpm lint` (both pass). Remaining work is operational, not code: pick the production-appropriate ISR window if 300s isn't right, and watch the Vercel Daily Consumption Breakdown post-deploy.

## Verification plan

- Build the app after each change: `pnpm build:app-0` (or `pnpm build`); confirm no errors.
- **T7:** Publish a Builder content change and confirm it appears within the new window (~5 min in prod); confirm preview/editing still updates instantly. Hit a random nonexistent URL twice and confirm the second is served from cache.
- **T6:** Load a page with a `cdn.builder.io` image; in DevTools confirm the optimized `/_next/image` response carries a long `Cache-Control`/`max-age`; confirm no request generates a 3840px variant.
- **T4:** Request `/sitemap.xml` twice; confirm the second is cache-served (no fresh Builder fetch in logs).
- **T1:** Request a `public/` asset and confirm the proxy does not run side effects; confirm a normal route still localizes and `?errorCode=500` still redirects to `/500`.
- **Post-deploy:** Watch the Vercel Daily Consumption Breakdown for ISR reads/writes, Image Optimization, and Function Invocations to drop over the following days.

## Not covered here / hand-offs

- **Render-blocking Font Awesome stylesheet** — `app/layout.tsx:49–55` loads `cdnjs.cloudflare.com/.../font-awesome/6.6.0/css/all.min.css` via a blocking `<link>` in `<head>`. This is a **Core Web Vitals / LCP** concern (and an external dependency), not MIU. Hand off to the `core-web-vitals` skill; consider self-hosting only the icons used.
- **Client/server component split & bundle size** — out of scope here; use `vercel-react-best-practices` if bundle size becomes a concern.
- **Quantified before/after** — use the `performance-comparison` skill to benchmark a preview deployment against production once fixes land.
