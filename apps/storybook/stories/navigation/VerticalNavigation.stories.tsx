import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import { VerticalNavigation } from '@repo/components';
import { TileContent } from '@repo/components';
import { textAlignments } from '@repo/types';

const meta = {
  title: 'Navigation/VerticalNavigation',
  component: VerticalNavigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'accent', 'gradient', 'transparent-light', 'transparent-dark'],
    },
    inheritTheme: {
      control: { type: 'boolean' },
    },
    className: {
      control: { type: 'text' },
    },
    headline: {
      control: { type: 'text' },
    },
    isHero: {
      control: { type: 'boolean' },
    },
    alignment: {
      control: { type: 'select' },
      options: textAlignments,
    },
  },
} satisfies Meta<typeof VerticalNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockNavigation = {
  data: {
    level1: [
      { text: 'Home', href: '/' },
      { text: 'About', href: '/about' },
      { text: 'Courses', href: '/courses' },
      { text: 'Workshops', href: '/workshops' },
      { text: 'Contact', href: '/contact' },
    ],
  },
  ownerId: 'mock-owner',
  lastUpdateBy: null,
  createdDate: Date.now(),
  id: 'mock-nav-id',
  '@version': 1 as const,
  name: 'Mock Navigation',
  modelId: 'navigation',
  published: 'published' as const,
  priority: 0,
  query: [],
  lastUpdated: Date.now(),
  firstPublished: Date.now(),
  testRatio: 0,
  createdBy: 'mock-user',
  lastUpdatedBy: 'mock-user',
};

export const Default: Story = {
  args: {
    navigation: mockNavigation,
    theme: 'light',
    headline: 'Navigation Menu',
    isHero: true,
    alignment: 'center',
    children: React.createElement('div', { className: 'space-y-6' }, 
      React.createElement('h3', { className: 'text-xl font-semibold text-theme-heading' }, 'Welcome to the Content Area'),
      React.createElement('p', { className: 'text-theme-text' }, 
        'This is the main content area. In a real application, this could contain any content - articles, product listings, forms, or other components.'
      ),
      React.createElement('div', { className: 'bg-theme-btn-bg/10 p-4 rounded-lg' },
        React.createElement('p', { className: 'text-theme-text text-sm' },
          'The navigation sidebar takes up about 25% of the width on larger screens and stacks on top on mobile devices for a responsive layout.'
        )
      )
    ),
  },
};

export const DarkTheme: Story = {
  args: {
    navigation: mockNavigation,
    theme: 'dark',
    children: React.createElement('div', { className: 'space-y-4' },
      React.createElement('h3', { className: 'text-xl font-semibold text-theme-heading' }, 'Dark Theme Content'),
      React.createElement('p', { className: 'text-theme-text' }, 'Content area with dark theme styling.')
    ),
  },
};

export const AccentTheme: Story = {
  args: {
    navigation: mockNavigation,
    theme: 'accent',
    children: React.createElement('div', { className: 'space-y-4' },
      React.createElement('h3', { className: 'text-xl font-semibold text-theme-heading' }, 'Accent Theme Content'),
      React.createElement('p', { className: 'text-theme-text' }, 'Content area with accent theme styling.')
    ),
  },
};

export const GradientTheme: Story = {
  args: {
    navigation: mockNavigation,
    theme: 'gradient',
  },
};

export const MinimalNavigation: Story = {
  args: {
    navigation: {
      ...mockNavigation,
      data: {
        level1: [
          { text: 'Home', href: '/' },
          { text: 'About', href: '/about' },
        ],
      },
    },
    theme: 'light',
    children: React.createElement('div', { className: 'space-y-4' },
      React.createElement('h3', { className: 'text-xl font-semibold text-theme-heading' }, 'Minimal Navigation'),
      React.createElement('p', { className: 'text-theme-text' }, 'This example shows how the layout works with fewer navigation items.')
    ),
  },
};

export const LongNavigation: Story = {
  args: {
    navigation: {
      ...mockNavigation,
      data: {
        level1: [
          { text: 'Home', href: '/' },
          { text: 'About Us', href: '/about' },
          { text: 'Courses', href: '/courses' },
          { text: 'Advanced Workshops', href: '/workshops' },
          { text: 'Private Sessions', href: '/sessions' },
          { text: 'Online Training', href: '/online' },
          { text: 'Certification Programs', href: '/certification' },
          { text: 'Community', href: '/community' },
          { text: 'Resources', href: '/resources' },
          { text: 'Contact', href: '/contact' },
        ],
      },
    },
    theme: 'light',
  },
};

export const EmptyNavigation: Story = {
  args: {
    navigation: {
      ...mockNavigation,
      data: {
        level1: [],
      },
    },
    theme: 'light',
  },
};

export const NoNavigation: Story = {
  args: {
    navigation: undefined,
    theme: 'light',
    headline: 'Content Only Layout',
    children: React.createElement('div', { className: 'space-y-4' },
      React.createElement('h3', { className: 'text-xl font-semibold text-theme-heading' }, 'No Navigation'),
      React.createElement('p', { className: 'text-theme-text' }, 
        'When no navigation is provided, the content takes up the full width. This is useful for pages that don\'t need a sidebar navigation.'
      )
    ),
  },
};

export const WithCustomClassName: Story = {
  args: {
    navigation: mockNavigation,
    theme: 'light',
    className: 'shadow-xl border-2 border-accent-purple',
  },
};

export const WithHeadlineAsHero: Story = {
  args: {
    navigation: mockNavigation,
    theme: 'light',
    headline: 'Main Navigation',
    isHero: true,
    alignment: 'center',
  },
};

export const WithHeadlineAsSubheading: Story = {
  args: {
    navigation: mockNavigation,
    theme: 'dark',
    headline: 'Quick Links',
    isHero: false,
    alignment: 'left',
  },
};

export const LeftAligned: Story = {
  args: {
    navigation: mockNavigation,
    theme: 'light',
    headline: 'Left Aligned Navigation',
    isHero: true,
    alignment: 'left',
    children: React.createElement('div', { className: 'space-y-4' },
      React.createElement('h3', { className: 'text-xl font-semibold text-theme-heading' }, 'Left Aligned Layout'),
      React.createElement('p', { className: 'text-theme-text' }, 
        'The navigation items and headline are aligned to the left side.'
      )
    ),
  },
};

export const RightAligned: Story = {
  args: {
    navigation: mockNavigation,
    theme: 'accent',
    headline: 'Right Aligned Navigation',
    isHero: false,
    alignment: 'right',
    children: React.createElement('div', { className: 'space-y-4' },
      React.createElement('h3', { className: 'text-xl font-semibold text-theme-heading' }, 'Right Aligned Layout'),
      React.createElement('p', { className: 'text-theme-text' }, 
        'The navigation items and headline are aligned to the right side.'
      )
    ),
  },
};

export const WithBuilderBlocks: Story = {
  args: {
    navigation: mockNavigation,
    theme: 'light',
    headline: 'Layout with Builder Blocks',
    content: {
      blocks: [
        {
          '@type': '@builder.io/sdk:Element',
          component: {
            name: 'Text',
            options: {
              text: '<h3>Content from Builder Blocks</h3><p>This content area can be populated with Builder.io blocks for dynamic content management.</p>',
            },
          },
        },
      ],
    },
  },
};