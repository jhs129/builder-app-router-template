import type { Meta, StoryObj } from "@storybook/nextjs";
import { TileQuote } from "@repo/components";

const meta: Meta<typeof TileQuote> = {
  title: "CTA/TileQuote",
  component: TileQuote,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: { type: "select" },
      options: [
        "light",
        "dark",
        "accent",
        "gradient",
        "transparent-light",
        "transparent-dark",
      ],
    },
    alignment: {
      control: { type: "select" },
      options: ["left", "center", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headline: "Overheard",
    quote: "This is an inspiring quote that will be displayed prominently.",
    theme: "light",
    alignment: "center",
  },
};

export const NoEyebrow: Story = {
  args: {
    quote: "Sometimes the most powerful quotes need no introduction.",
    theme: "light",
    alignment: "center",
  },
};

export const Dark: Story = {
  args: {
    headline: "Customer Feedback",
    quote: "This product has completely transformed the way we work.",
    theme: "dark",
    alignment: "center",
  },
};

export const Accent: Story = {
  args: {
    headline: "Testimonial",
    quote: "An absolutely amazing experience from start to finish.",
    theme: "accent",
    alignment: "center",
  },
};

export const Gradient: Story = {
  args: {
    headline: "Review",
    quote:
      "I would recommend this to anyone looking for quality and reliability.",
    theme: "gradient",
    alignment: "center",
  },
};

export const LeftAlign: Story = {
  args: {
    headline: "Left Aligned",
    quote:
      "This quote demonstrates left alignment for better design flexibility.",
    theme: "light",
    alignment: "left",
  },
};

export const RightAlign: Story = {
  args: {
    headline: "Right Aligned",
    quote: "This quote demonstrates right alignment for unique layouts.",
    theme: "accent",
    alignment: "right",
  },
};

export const TransparentLight: Story = {
  args: {
    headline: "Overlay Quote",
    quote:
      "This transparent theme is perfect for placing over images or backgrounds.",
    theme: "transparent-light",
    alignment: "center",
  },
};

export const TransparentDark: Story = {
  args: {
    headline: "Overlay Quote",
    quote: "This dark transparent theme works great over light backgrounds.",
    theme: "transparent-dark",
    alignment: "center",
  },
};
