import type { ArticleData, SiteContext } from "@repo/types";

/**
 * Converts ArticleData to ArticleSchemaData props following schema.org best practices
 */
export function articleToSchemaData(
  article: ArticleData,
  siteContext?: SiteContext,
  baseUrl?: string
) {
  const url = `${baseUrl || ""}/blogs/${article.handle}`;

  return {
    "@type": "BlogPosting" as const,
    id: url,
    headline: article.title,
    alternativeHeadline: article.subtitle,
    description: article.metadata?.description,
    image: article.image,
    datePublished: article.publishDate,
    url,
    keywords: article.metadata?.keywords,
    articleSection: "Blog",
    wordCount: getArticleWordCount(article.blocks),
    inLanguage: "en-US",
    ...(siteContext && {
      publisher: {
        name: siteContext.data.organization.name,
        url: baseUrl,
        ...(siteContext.data.logo && {
          logo: {
            url: siteContext.data.logo,
            width: 200,
            height: 60,
          },
        }),
      },
      isPartOf: {
        "@id": baseUrl || "",
        name: siteContext.data.siteName,
        url: baseUrl,
      },
    }),
  };
}

/**
 * Gets estimated word count from article blocks
 */
export function getArticleWordCount(blocks: any[]): number {
  let wordCount = 0;
  
  if (!blocks || !Array.isArray(blocks)) {
    return 0;
  }
  
  blocks.forEach((block) => {
    if (block.component?.options?.text || block.component?.options?.content) {
      const text = block.component.options.text || block.component.options.content;
      if (typeof text === 'string') {
        // Simple word count estimation
        wordCount += text.split(/\s+/).filter(word => word.length > 0).length;
      }
    }
  });
  
  return wordCount;
}