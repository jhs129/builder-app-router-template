import type { Meta, StoryObj } from '@storybook/nextjs';
import { ArticleSchemaData } from '@repo/components';

const meta = {
  title: 'SEO/ArticleSchemaData',
  component: ArticleSchemaData,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'ArticleSchemaData generates structured data for articles, blog posts, and news articles using JSON-LD format for SEO.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ArticleSchemaData>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    '@type': 'BlogPosting' as const,
    id: 'https://example.com/blog/sample-post',
    headline: 'How to Improve Your Website SEO',
    url: 'https://example.com/blog/seo-guide',
    datePublished: '2024-01-15T10:00:00Z',
  },
};

export const NewsArticle: Story = {
  args: {
    '@type': 'NewsArticle' as const,
    id: 'https://news.example.com/breaking-news-123',
    headline: 'Breaking: Major Technology Breakthrough Announced',
    url: 'https://news.example.com/tech-breakthrough-2024',
    datePublished: '2024-02-01T08:00:00Z',
  },
};

export const WithDescription: Story = {
  args: {
    '@type': 'Article' as const,
    id: 'https://journal.example.com/articles/climate-change-study',
    headline: 'Impact of Climate Change on Marine Ecosystems',
    description: 'This study examines the effects of rising ocean temperatures on marine biodiversity.',
    url: 'https://journal.example.com/marine-climate-study-2024',
    datePublished: '2024-03-15T00:00:00Z',
  },
};