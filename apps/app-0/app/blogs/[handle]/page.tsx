import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchOneEntry, fetchEntries } from "@builder.io/sdk-react";
import {
  DefaultHeader,
  DefaultFooter,
  Banner100,
  TileCTA,
  ThemeProvider,
  ArticleSchemaData,
  articleToSchemaData,
  buildPageMetadata,
} from "@repo/components";
import type { SiteContext } from "@repo/types";
import { BUILDER_API_KEY, getSiteContext } from "../../../lib/builder";
import { isPreviewingFromSearchParams } from "../../../lib/page-utils";
import RenderBuilderContent from "../../../components/RenderBuilderContent";

export const revalidate = 5;

function formatDate(timestamp: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function fetchArticle(handle: string, locale: string) {
  return fetchOneEntry({
    model: "article",
    apiKey: BUILDER_API_KEY,
    query: { "data.handle": handle },
    enrich: true,
    locale,
  });
}

export async function generateStaticParams(): Promise<{ handle: string }[]> {
  const articles = await fetchEntries({
    model: "article",
    apiKey: BUILDER_API_KEY,
    fields: "data.handle",
    options: { noTargeting: true },
  });

  return articles
    .map((article) => String(article.data?.handle))
    .filter(Boolean)
    .map((handle) => ({ handle }));
}

interface BlogRouteProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: BlogRouteProps): Promise<Metadata> {
  const { handle } = await params;
  const [article, siteContext] = await Promise.all([
    fetchArticle(handle, "en"),
    getSiteContext("en"),
  ]);

  return buildPageMetadata({
    title: article?.data?.title || "",
    description: article?.data?.metadata?.description || article?.data?.excerpt || "",
    siteName: (siteContext as SiteContext | null)?.data?.siteName,
    image: article?.data?.image,
    url: handle ? `/blogs/${handle}` : undefined,
    type: "article",
    publishedDate: article?.data?.publishDate,
    author: article?.data?.author,
    keywords: article?.data?.metadata?.keywords,
  });
}

export default async function BlogPage({
  params,
  searchParams,
}: BlogRouteProps) {
  const { handle } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = "en";

  const [article, siteContext] = await Promise.all([
    fetchArticle(handle, locale),
    getSiteContext(locale),
  ]);

  const isPreviewing = isPreviewingFromSearchParams(resolvedSearchParams);

  if (!article && !isPreviewing) {
    notFound();
  }

  const publishedDate = formatDate(
    article?.data?.publishDate || article?.lastUpdated
  );

  const origin = process.env.NEXT_PUBLIC_SITE_URL;

  const rawPublishDate = article?.data?.publishDate || article?.lastUpdated;

  const schemaProps =
    article && rawPublishDate
      ? articleToSchemaData(
          {
            handle: article.data?.handle || "",
            title: article.data?.title || "",
            subtitle: article.data?.subtitle || "",
            image: article.data?.image || "",
            excerpt: article.data?.excerpt || "",
            metadata: {
              description:
                article.data?.description || article.data?.excerpt || "",
              keywords: article.data?.keywords || [],
            },
            publishDate: new Date(rawPublishDate).toISOString(),
            dateModified: article.lastUpdated
              ? new Date(article.lastUpdated).toISOString()
              : undefined,
            author: article.data?.author,
            blocks: article.data?.blocks || [],
          },
          (siteContext as SiteContext | null) || undefined,
          origin
        )
      : null;

  return (
    <div className="flex flex-col min-h-screen">
      <DefaultHeader />
      <main id="main-content" className="flex-grow" role="main">
        {schemaProps && <ArticleSchemaData {...schemaProps} />}
        <ThemeProvider>
          <Banner100
            backgroundImage={
              article?.data?.image ||
              "https://placehold.co/800x600/EEE/5ce1e6.png"
            }
            backgroundType="image"
            alignment="center"
            theme="accent"
            maskOpacity={0}
          >
            <TileCTA
              eyebrow={article?.data?.subtitle || ""}
              headline={article?.data?.title || ""}
              content={article?.data?.excerpt || ""}
              theme="transparent-dark"
              isHero={true}
              alignment="left"
              maskOpacity={0.1}
              inheritTheme={false}
            />
          </Banner100>
          <article className="container mx-auto px-4 py-8">
            <h6>Published: {publishedDate}</h6>
            <RenderBuilderContent
              content={article}
              model="article"
              locale={locale}
            />
          </article>
        </ThemeProvider>
      </main>
      <DefaultFooter />
    </div>
  );
}
