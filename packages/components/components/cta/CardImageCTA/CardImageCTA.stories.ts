import type { Meta, StoryObj } from "@storybook/nextjs";
import { CardImageCTA } from "@repo/components";

const meta: Meta<typeof CardImageCTA> = {
  title: "CTA/CardImageCTA",
  component: CardImageCTA,
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
    image: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    image: "https://placehold.co/600x400/EEE/31343C.png",
    eyebrow: "Featured",
    title: "Your Title Here",
    buttonLabel: "Learn More",
    buttonHref: "#",
    alignment: "center",
    theme: "light",
  },
};

export const NoButton: Story = {
  args: {
    image: "https://placehold.co/600x400/EEE/31343C.png",
    eyebrow: "Announcement",
    title: "Important Information Without Action",
    buttonLabel: "",
    alignment: "center",
    theme: "light",
  },
};

export const DarkTheme: Story = {
  args: {
    image: "https://placehold.co/600x400/374151/9CA3AF.png",
    eyebrow: "Eyebrow",
    title: "This is a title",
    buttonLabel: "Button Label",
    buttonHref: "#",
    alignment: "center",
    theme: "dark",
  },
};

export const AccentTheme: Story = {
  args: {
    image: "https://placehold.co/600x400/DBEAFE/3B82F6.png",
    eyebrow: "Special Offer",
    title: "Limited Time Workshop",
    buttonLabel: "Register Today",
    buttonHref: "/workshops/special",
    alignment: "center",
    theme: "accent",
  },
};

export const GradientTheme: Story = {
  args: {
    image: "https://placehold.co/600x400/F3E8FF/8B5CF6.png",
    eyebrow: "Premium Content",
    title: "Advanced Meditation Techniques",
    buttonLabel: "Start Learning",
    buttonHref: "/premium/meditation",
    alignment: "center",
    theme: "gradient",
  },
};

export const LeftAlign: Story = {
  args: {
    image: "https://placehold.co/600x400/FEF3C7/F59E0B.png",
    eyebrow: "Left Aligned",
    title: "Content Aligned to the Left",
    buttonLabel: "Learn More",
    buttonHref: "#",
    alignment: "left",
    theme: "light",
  },
};

export const RightAlign: Story = {
  args: {
    image: "https://placehold.co/600x400/ECFDF5/10B981.png",
    eyebrow: "Right Aligned",
    title: "Content Aligned to the Right",
    buttonLabel: "Get Started",
    buttonHref: "#",
    alignment: "right",
    theme: "accent",
  },
};

export const TransparentLight: Story = {
  args: {
    image: "https://placehold.co/600x400/F0F9FF/0EA5E9.png",
    eyebrow: "Overlay Content",
    title: "Transparent Light Theme",
    buttonLabel: "Learn More",
    buttonHref: "#",
    alignment: "center",
    theme: "transparent-light",
  },
};

export const TransparentDark: Story = {
  args: {
    image: "https://placehold.co/600x400/1E293B/64748B.png",
    eyebrow: "Overlay Content",
    title: "Transparent Dark Theme",
    buttonLabel: "Get Started",
    buttonHref: "#",
    alignment: "center",
    theme: "transparent-dark",
  },
};

export const LongTitle: Story = {
  args: {
    image: "https://placehold.co/600x400/FEE2E2/EF4444.png",
    eyebrow: "Workshop Series",
    title:
      "Transform Your Life Through Mind Control and Positive Visualization Techniques",
    buttonLabel: "Join Workshop",
    buttonHref: "/workshops/transform",
    alignment: "center",
    theme: "light",
  },
};
