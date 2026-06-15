import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from '@repo/components';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'accent', 'gradient', 'transparent-light', 'transparent-dark'],
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Button',
    theme: 'light',
  },
};

export const DarkTheme: Story = {
  args: {
    label: 'Button',
    theme: 'dark',
  },
};

export const AccentTheme: Story = {
  args: {
    label: 'Button',
    theme: 'accent',
  },
};

export const GradientTheme: Story = {
  args: {
    label: 'Button',
    theme: 'gradient',
  },
};

export const TransparentLight: Story = {
  args: {
    label: 'Button',
    theme: 'transparent-light',
  },
};

export const TransparentDark: Story = {
  args: {
    label: 'Button',
    theme: 'transparent-dark',
  },
};

export const WithHref: Story = {
  args: {
    label: 'Go to Home',
    href: '/',
    theme: 'light',
  },
};