import type { Meta, StoryObj } from '@storybook/nextjs';
import { TileContent, Button } from "@repo/components";

const meta: Meta<typeof TileContent> = {
  title: "CTA/TileContent",
  component: TileContent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["light", "dark", "accent", "gradient", "transparent-light", "transparent-dark"],
    },
    alignment: {
      control: { type: "select" },
      options: ["left", "center", "right"],
    },
    isHero: {
      control: { type: "boolean" },
    },
    maskOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
    },
    eyebrowLevel: {
      control: { type: "select" },
      options: ["h5", "h6"],
    },
    subheadlineLevel: {
      control: { type: "select" },
      options: ["h2", "h3", "h4", "h5", "h6"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headline: "Your Content Title",
    content: "Add your content description here. This supports rich text formatting.",
    alignment: "center",
    theme: "light",
    isHero: false,
    maskOpacity: 0.3,
  },
};

export const WithSingleButton: Story = {
  args: {
    headline: "Get Started Today",
    content: "Transform your life with proven techniques that have helped millions achieve their goals.",
    alignment: "center",
    theme: "light",
    isHero: false,
    maskOpacity: 0.3,
  },
  render: (args) => (
    <TileContent {...args}>
      <Button label="Learn More" href="#" theme={args.theme} />
    </TileContent>
  ),
};

export const WithMultipleButtons: Story = {
  args: {
    headline: "Choose Your Path",
    content: "Whether you're a beginner or looking to advance your practice, we have the perfect course for you.",
    alignment: "center",
    theme: "light",
    isHero: false,
    maskOpacity: 0.3,
  },
  render: (args) => (
    <TileContent {...args}>
      <Button label="Get Started" href="#" theme={args.theme} />
      <Button label="Learn More" href="#" theme={args.theme} />
    </TileContent>
  ),
};

export const HeroVersion: Story = {
  args: {
    headline: "Lorem ipsum dolor sit amet",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    alignment: "center",
    theme: "accent",
    isHero: true,
    maskOpacity: 0.3,
  },
  render: (args) => (
    <TileContent {...args}>
      <Button label="Button Label" href="#" theme={args.theme} />
      <Button label="Button Label" href="#" theme={args.theme} />
    </TileContent>
  ),
};

export const LeftAligned: Story = {
  args: {
    headline: "Left Aligned Content",
    content: "This content is aligned to the left, perfect for asymmetrical layouts and modern design patterns.",
    alignment: "left",
    theme: "dark",
    isHero: false,
    maskOpacity: 0.3,
  },
  render: (args) => (
    <TileContent {...args}>
      <Button label="Continue" href="#" theme={args.theme} />
    </TileContent>
  ),
};

export const RightAligned: Story = {
  args: {
    headline: "Right Aligned Content",
    content: "This content is aligned to the right, creating visual interest and breaking traditional patterns.",
    alignment: "right",
    theme: "gradient",
    isHero: false,
    maskOpacity: 0.3,
  },
  render: (args) => (
    <TileContent {...args}>
      <Button label="Get Started" href="#" theme={args.theme} />
    </TileContent>
  ),
};

export const TransparentLight: Story = {
  args: {
    headline: "Overlay Content",
    content: "This transparent theme is perfect for placing over images or custom backgrounds.",
    alignment: "center",
    theme: "transparent-light",
    isHero: false,
    maskOpacity: 0,
  },
  render: (args) => (
    <TileContent {...args}>
      <Button label="Learn More" href="#" theme={args.theme} />
    </TileContent>
  ),
};

export const TransparentDark: Story = {
  args: {
    headline: "Dark Overlay Content",
    content: "This dark transparent theme works great over light backgrounds and images.",
    alignment: "center",
    theme: "transparent-dark",
    isHero: false,
    maskOpacity: 0,
  },
  render: (args) => (
    <TileContent {...args}>
      <Button label="Get Started" href="#" theme={args.theme} />
    </TileContent>
  ),
};

export const RichTextContent: Story = {
  args: {
    headline: "Rich Text Example",
    content: `
      <p>This content demonstrates <strong>rich text formatting</strong> capabilities.</p>
      <ul>
        <li>Bullet point one</li>
        <li>Bullet point two</li>
        <li>Bullet point three</li>
      </ul>
      <p><em>You can use HTML formatting</em> to create engaging content.</p>
    `,
    alignment: "left",
    theme: "light",
    isHero: false,
    maskOpacity: 0.3,
  },
  render: (args) => (
    <TileContent {...args}>
      <Button label="Explore Features" href="#" theme={args.theme} />
      <Button label="Contact Us" href="#" theme={args.theme} />
    </TileContent>
  ),
};

export const WithEyebrowAndSubheadline: Story = {
  args: {
    eyebrow: "Featured Course",
    eyebrowLevel: "h6",
    headline: "Master Meditation",
    subheadline: "Transform Your Mind in 30 Days",
    subheadlineLevel: "h3",
    content: "This comprehensive course will teach you advanced meditation techniques used by millions worldwide.",
    alignment: "center",
    theme: "light",
    isHero: false,
    maskOpacity: 0.3,
  },
  render: (args) => (
    <TileContent {...args}>
      <Button label="Enroll Now" href="#" theme={args.theme} />
      <Button label="Free Preview" href="#" theme={args.theme} />
    </TileContent>
  ),
};

export const HighMaskOpacity: Story = {
  args: {
    headline: "Overlay Content",
    content: "With high mask opacity, this content appears over a dark overlay, perfect for dramatic effects.",
    alignment: "center",
    theme: "light",
    isHero: false,
    maskOpacity: 0.8,
  },
  render: (args) => (
    <TileContent {...args}>
      <Button label="Learn More" href="#" theme={args.theme} />
    </TileContent>
  ),
};

export const NoMask: Story = {
  args: {
    headline: "Clean Layout",
    content: "With zero mask opacity, this content has a clean, minimal appearance without any overlay effects.",
    alignment: "center",
    theme: "light",
    isHero: false,
    maskOpacity: 0,
  },
  render: (args) => (
    <TileContent {...args}>
      <Button label="Get Started" href="#" theme={args.theme} />
    </TileContent>
  ),
};