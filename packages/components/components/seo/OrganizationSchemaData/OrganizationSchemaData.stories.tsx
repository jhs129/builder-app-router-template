import type { Meta, StoryObj } from '@storybook/nextjs';
import { OrganizationSchemaData } from '@repo/components';

const meta = {
  title: 'SEO/OrganizationSchemaData',
  component: OrganizationSchemaData,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'OrganizationSchemaData generates structured data for organizations using JSON-LD format for SEO.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OrganizationSchemaData>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Tech Innovation Corp',
    url: 'https://techinnovation.example.com',
    description: 'Leading technology company specializing in AI and ML solutions.',
    '@id': 'https://techinnovation.example.com#organization',
  },
};

export const WithFoundingDate: Story = {
  args: {
    name: 'Startup Innovations LLC',
    url: 'https://startupinnovations.example.com',
    description: 'Innovative startup focused on developing cutting-edge applications.',
    foundingDate: '2020-06-15',
  },
};

export const MinimalOrganization: Story = {
  args: {
    name: 'Simple Company',
  },
};