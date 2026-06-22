import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchOneEntry, fetchEntries } from "@builder.io/sdk-react";
import { Header, Footer, PageSchema, buildPageMetadata } from "@repo/components";
import type { Navigation, SiteContext } from "@repo/types";
import { BUILDER_API_KEY, getSiteContext } from "../../lib/builder";
import {
  resolvePageParams,
  formatLastUpdatedDate,
  isPreviewingFromSearchParams,
} from "../../lib/page-utils";
import RenderBuilderContent from "../../components/RenderBuilderContent";

// ISR window (seconds) for published Builder.io content. Must be a literal —
// App Router segment config is statically analyzed and rejects runtime/env
// expressions. Editors still get instant updates via Builder preview mode.
export const revalidate = 300;

// Directories / pages that have their own route implementations.
const EXCLUDED_DIRECTORIES = ["/blogs"];
const STANDALONE_PAGES = ["/404"];

// Build a BreadcrumbList trail (Home + one entry per path segment) from the
// resolved url path. Returns undefined for the site root, which has no trail.
function buildBreadcrumb(urlPath: string, siteUrl: string) {
  const segments = urlPath.split("/").filter(Boolean);
  if (segments.length === 0) return undefined;

  const toLabel = (segment: string) =>
    segment
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const crumbs = [{ position: 1, name: "Home", item: siteUrl }];
  let path = "";
  segments.forEach((segment, index) => {
    path += `/${segment}`;
    crumbs.push({
      position: index + 2,
      name: toLabel(segment),
      item: `${siteUrl}${path}`,
    });
  });

  return crumbs;
}

function shouldExcludePath(url: string): boolean {
  if (!url) return true;
  const isExcludedDirectory = EXCLUDED_DIRECTORIES.some((dir) =>
    url.startsWith(dir)
  );
  const isStandalonePage = STANDALONE_PAGES.includes(url);
  return isExcludedDirectory || isStandalonePage;
}

export async function generateStaticParams(): Promise<{ page: string[] }[]> {
  const pages = await fetchEntries({
    model: "page",
    apiKey: BUILDER_API_KEY,
    fields: "data.url",
    options: { noTargeting: true },
  });

  return pages
    .map((page) => String(page.data?.url))
    .filter((url) => !shouldExcludePath(url))
    .map((url) => ({
      page: url.split("/").filter(Boolean),
    }));
}

interface PageRouteProps {
  params: Promise<{ page?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: PageRouteProps): Promise<Metadata> {
  const { page: segments } = await params;
  const { locale, urlPath } = resolvePageParams(segments);

  const [page, siteContext] = await Promise.all([
    fetchOneEntry({
      model: "page",
      apiKey: BUILDER_API_KEY,
      userAttributes: { urlPath },
      enrich: true,
      locale,
    }),
    getSiteContext(locale),
  ]);

  const base = buildPageMetadata({
    title: page?.data?.title || "",
    description: page?.data?.metadata?.description || "",
    siteName: siteContext?.data?.siteName,
    image: page?.data?.image,
    url: page?.data?.url,
    type: "website",
    keywords: page?.data?.metadata?.keywords,
  });

  // The original page forced noindex.
  return {
    ...base,
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params, searchParams }: PageRouteProps) {
  const { page: segments } = await params;
  const resolvedSearchParams = await searchParams;
  const { locale, urlPath } = resolvePageParams(segments);

  const [page, siteContext] = await Promise.all([
    fetchOneEntry({
      model: "page",
      apiKey: BUILDER_API_KEY,
      userAttributes: { urlPath },
      enrich: true,
      locale,
    }),
    getSiteContext(locale),
  ]);

  const isPreviewing = isPreviewingFromSearchParams(resolvedSearchParams);

  if (!page && !isPreviewing) {
    notFound();
  }

  const lastUpdatedDate = formatLastUpdatedDate(page?.lastUpdated);
  const site = siteContext as SiteContext | null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  const toIso = (timestamp?: number) =>
    timestamp ? new Date(timestamp).toISOString() : undefined;

  const orgAddress = site?.data.organization?.address;

  return (
    <div className="flex flex-col min-h-screen">
      <Header navigation={site?.data?.headerNavigation1?.value as Navigation | undefined} />
      <main id="main-content" className="flex-grow" role="main">
        {site && (
          <PageSchema
            title={page?.data?.title || ""}
            description={page?.data?.metadata?.description || ""}
            url={page?.data?.url ? `${siteUrl}${page.data.url}` : siteUrl}
            siteName={site.data.siteName}
            siteUrl={siteUrl}
            organizationName={site.data.organization?.name || site.data.siteName}
            organizationDescription={site.data.organization?.description}
            logo={site.data.logo}
            sameAs={site.data.socialNetworks?.map((network) => network.href)}
            address={
              orgAddress
                ? {
                    streetAddress: orgAddress.address1,
                    addressLocality: orgAddress.city,
                    addressRegion: orgAddress.state,
                    postalCode: orgAddress.postalCode,
                    addressCountry: orgAddress.country,
                  }
                : undefined
            }
            contactPoint={
              site.data.contact
                ? [
                    {
                      contactType: "customer service",
                      telephone: site.data.contact.telephone,
                      email: site.data.contact.email,
                      areaServed: site.data.contact.areaServed,
                      availableLanguage: site.data.contact.availableLanguages,
                    },
                  ]
                : undefined
            }
            image={page?.data?.image}
            keywords={page?.data?.metadata?.keywords}
            publishedDate={toIso(page?.firstPublished) || toIso(page?.lastUpdated)}
            modifiedDate={toIso(page?.lastUpdated)}
            breadcrumb={buildBreadcrumb(urlPath, siteUrl)}
          />
        )}
        <RenderBuilderContent
          content={page}
          model="page"
          locale={locale}
          data={{ siteContext: site, lastUpdatedDate }}
        />
      </main>
      <Footer navigation={page?.data?.footerNavigation?.value} />
    </div>
  );
}
