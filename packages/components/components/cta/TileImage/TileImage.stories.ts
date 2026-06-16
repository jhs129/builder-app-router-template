import type { Meta, StoryObj } from "@storybook/nextjs";
import { TileImage } from "@repo/components";

const meta: Meta<typeof TileImage> = {
  title: "CTA/TileImage",
  component: TileImage,
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
    image: "https://placehold.co/600x400/EEE/31343C.png",
    headline: "This is a headline",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonLabel: "Button Label",
    buttonHref: "#",
    alignment: "center",
    theme: "light",
  },
};

export const WithoutButton: Story = {
  args: {
    image: "https://placehold.co/600x400/333/FFF.png",
    headline: "This is a headline",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    alignment: "center",
    theme: "dark",
  },
};

export const LeftAligned: Story = {
  args: {
    image: "https://placehold.co/600x400/4A90E2/FFF.png",
    headline: "This is a headline",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonLabel: "Button Label",
    buttonHref: "#",
    alignment: "left",
    theme: "transparent-light",
  },
};

export const RightAligned: Story = {
  args: {
    image: "https://placehold.co/600x400/7ED321/FFF.png",
    headline: "This is a headline",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonLabel: "Button Label",
    buttonHref: "#",
    alignment: "right",
    theme: "transparent-dark",
  },
};

export const DarkTheme: Story = {
  args: {
    image: "https://placehold.co/600x400/1A1A1A/FFF.png",
    headline: "This is a headline",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonLabel: "Button Label",
    buttonHref: "#",
    alignment: "center",
    theme: "dark",
  },
};

export const AccentTheme: Story = {
  args: {
    image: "https://placehold.co/600x400/9013FE/FFF.png",
    headline: "This is a headline",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonLabel: "Button Label",
    buttonHref: "#",
    alignment: "center",
    theme: "accent",
  },
};

export const GradientTheme: Story = {
  args: {
    image: "https://placehold.co/600x400/FF6B35/FFF.png",
    headline: "This is a headline",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonLabel: "Button Label",
    buttonHref: "#",
    alignment: "center",
    theme: "gradient",
  },
};

export const TransparentLight: Story = {
  args: {
    image: "https://placehold.co/600x400/50E3C2/333.png",
    headline: "This is a headline",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonLabel: "Button Label",
    buttonHref: "#",
    alignment: "center",
    theme: "transparent-light",
  },
};

export const TransparentDark: Story = {
  args: {
    image: "https://placehold.co/600x400/BD10E0/FFF.png",
    headline: "This is a headline",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonLabel: "Button Label",
    buttonHref: "#",
    alignment: "center",
    theme: "transparent-dark",
  },
};

export const RichContent: Story = {
  args: {
    image: "https://placehold.co/600x400/F5A623/FFF.png",
    headline: "Advanced Training",
    content: `
      <p><strong>Transform your life</strong> with proven techniques:</p>
      <ul>
        <li>Lorem ipsum dolor sit amet</li>
        <li>Consectetur adipiscing elit</li>
        <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li>
      </ul>
      <p><em>Join thousands who have already transformed their lives.</em></p>
    `,
    buttonLabel: "Button Label",
    buttonHref: "#",
    alignment: "left",
    theme: "dark",
  },
};
