import type { Meta, StoryObj } from '@storybook/nextjs';
import { DesignKitOverview } from '@repo/components';

const meta = {
  title: 'UI/DesignKitOverview',
  component: DesignKitOverview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'DesignKitOverview provides a comprehensive view of all design elements, typography, colors, and components in the design system. It includes interactive theme switching and opacity controls.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark', 'accent', 'gradient', 'transparent-light', 'transparent-dark'],
      description: 'Theme for the design kit overview',
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
} satisfies Meta<typeof DesignKitOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    theme: 'light',
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
  },
};

export const AccentTheme: Story = {
  args: {
    theme: 'accent',
  },
};

export const GradientTheme: Story = {
  args: {
    theme: 'gradient',
  },
};

export const TransparentLight: Story = {
  args: {
    theme: 'transparent-light',
  },
};

export const TransparentDark: Story = {
  args: {
    theme: 'transparent-dark',
  },
};

export const WithInheritance: Story = {
  args: {
    inheritTheme: true,
  },
};

export const WithCustomClassName: Story = {
  args: {
    theme: 'accent',
    className: 'shadow-xl',
  },
};