import type { Meta, StoryObj } from '@storybook/react';
import { Headline } from '@repo/components';

const meta: Meta<typeof Headline> = {
  title: 'UI/Headline',
  component: Headline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isHero: {
      control: 'boolean',
      description: 'Whether this headline is the main hero heading (renders as h1)',
    },
    level: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'HTML heading level (ignored if isHero is true)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
    children: {
      control: 'text',
      description: 'The headline text content (supports HTML)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default Headline',
    level: 'h3',
    isHero: false,
  },
};

export const Hero: Story = {
  args: {
    children: 'Hero Headline',
    level: 'h3',
    isHero: true,
  },
};

export const AllLevels: Story = {
  render: (args) => (
    <div className="space-y-4">
      <Headline level="h1" {...args}>H1 Headline</Headline>
      <Headline level="h2" {...args}>H2 Headline</Headline>
      <Headline level="h3" {...args}>H3 Headline</Headline>
      <Headline level="h4" {...args}>H4 Headline</Headline>
      <Headline level="h5" {...args}>H5 Headline</Headline>
      <Headline level="h6" {...args}>H6 Headline</Headline>
    </div>
  ),
  args: {
    className: '',
  },
};

export const WithCustomStyling: Story = {
  args: {
    children: 'Styled Headline',
    level: 'h2',
    className: 'text-blue-600 font-bold text-4xl',
  },
};

export const WithHtmlContent: Story = {
  args: {
    children: 'Headline with <em>emphasis</em> and <strong>strong</strong> text',
    level: 'h2',
  },
};