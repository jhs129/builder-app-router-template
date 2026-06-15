import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchOneEntry, fetchEntries } from "@builder.io/sdk-react";
import { Header, Footer, PageSchema, buildPageMetadata } from "@repo/components";
import type { SiteContext } from "@repo/types";
import { BUILDER_API_KEY, getSiteContext } from "../../lib/builder";
import {
  resolvePageParams,
  formatLastUpdatedDate,
  isPreviewingFromSearchParams,
} from "../../lib/page-utils";
import RenderBuilderContent from "../../components/RenderBuilderContent";

export const revalidate = 5;

// Directories / pages that have their own route implementations.
const EXCLUDED_DIRECTORIES = ["/blogs"];
const STANDALONE_PAGES = ["/404"];

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header navigation={page?.data?.headerNavigation1?.value} />
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
            image={page?.data?.image}
            keywords={page?.data?.metadata?.keywords}
            isRoot={urlPath === "/"}
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
