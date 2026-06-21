import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DynamicLink } from "./index";

const meta = {
  title: "UI/DynamicLink",
  component: DynamicLink,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DynamicLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UrlLink: Story = {
  args: {
    link: { type: "url", href: "/about" },
    label: "About Us",
  },
};

export const ExternalLink: Story = {
  args: {
    link: { type: "url", href: "https://builder.io", openInNewTab: true },
    label: "Builder.io",
  },
};

export const StringLink: Story = {
  args: {
    link: "/contact",
    label: "Contact",
  },
};

export const ModelLink: Story = {
  args: {
    link: {
      type: "model",
      href: "/blogs/hello-world",
      model: "article",
      referenceId: "abc123",
    },
    label: "Read Article",
  },
};

export const WithNewTab: Story = {
  args: {
    link: { type: "url", href: "/privacy" },
    label: "Privacy Policy",
    openInNewTab: true,
  },
};
