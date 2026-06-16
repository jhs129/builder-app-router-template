import type { Meta, StoryObj } from '@storybook/nextjs';
import { TileCTA } from '@repo/components';

const meta = {
  title: 'CTA/TileCTA',
  component: TileCTA,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'accent', 'gradient', 'transparent-light', 'transparent-dark'],
    },
    alignment: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
    },
  },
} satisfies Meta<typeof TileCTA>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: "Eyebrow",
    headline: "This is a headline",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonLabel: "Button Label",
    buttonHref: "#",
    alignment: "center",
    theme: "light",
  },
};

export const DarkTheme: Story = {
  args: {
    ...Default.args,
    theme: "dark",
  },
};

export const AccentTheme: Story = {
  args: {
    ...Default.args,
    theme: "accent",
  },
};

export const GradientTheme: Story = {
  args: {
    ...Default.args,
    theme: "gradient",
  },
};

export const WithoutEyebrow: Story = {
  args: {
    ...Default.args,
    eyebrow: undefined,
  },
};

export const LeftAligned: Story = {
  args: {
    ...Default.args,
    eyebrow: "LEFT ALIGNED",
    headline: "Content Aligned to the Left",
    alignment: "left",
    theme: "light",
  },
};

export const RightAligned: Story = {
  args: {
    ...Default.args,
    eyebrow: "RIGHT ALIGNED", 
    headline: "Content Aligned to the Right",
    alignment: "right",
    theme: "accent",
  },
};