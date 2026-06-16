import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeProvider } from '@repo/components';

const meta = {
  title: 'Common/ThemeProvider',
  component: ThemeProvider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark', 'accent', 'gradient', 'transparent-light', 'transparent-dark'],
      description: 'Theme to apply to the provider',
    },
    inheritTheme: {
      control: 'boolean',
      description: 'Whether to inherit theme from parent context',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Theme Provider Content',
  },
};

export const LightTheme: Story = {
  args: {
    theme: 'light',
    children: 'Light Theme Content',
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    children: 'Dark Theme Content',
  },
};

export const AccentTheme: Story = {
  args: {
    theme: 'accent',
    children: 'Accent Theme Content',
  },
};

export const GradientTheme: Story = {
  args: {
    theme: 'gradient',
    children: 'Gradient Theme Content',
  },
};

export const TransparentLight: Story = {
  args: {
    theme: 'transparent-light',
    children: 'Transparent Light Theme Content',
  },
};

export const TransparentDark: Story = {
  args: {
    theme: 'transparent-dark',
    children: 'Transparent Dark Theme Content',
  },
};

export const WithInheritance: Story = {
  args: {
    inheritTheme: true,
    children: 'Inheriting Theme from Parent',
  },
};

export const WithCustomClassName: Story = {
  args: {
    theme: 'accent',
    className: 'p-8 rounded-lg shadow-lg',
    children: 'Custom Styled Theme Provider',
  },
};