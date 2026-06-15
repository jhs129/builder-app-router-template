import type { Meta, StoryObj } from "@storybook/nextjs";
import { Tabs } from "@repo/components";
import { standardThemes } from "@repo/types/design-kit/themeable";

const meta: Meta<typeof Tabs> = {
  title: "Layout/Tabs",
  component: Tabs,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      options: standardThemes,
    },
    headline: {
      control: "text",
      description: "Main heading for the tabs section",
    },
    isHero: {
      control: "boolean",
      description: "Whether this is the main hero (affects heading levels)",
    },
    tabs: {
      control: { type: "object" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    theme: "light",
    headline: "Content Tabs",
    isHero: false,
    tabs: [
      {
        headline: "Overview",
        type: "content",
        content: {
          blocks: [],
        },
      },
      {
        headline: "Features",
        type: "content",
        content: {
          blocks: [],
        },
      },
      {
        headline: "Pricing",
        type: "content",
        content: {
          blocks: [],
        },
      },
    ],
  },
};

export const WithLinks: Story = {
  args: {
    theme: "light",
    headline: "Navigation Tabs",
    isHero: false,
    tabs: [
      {
        headline: "Home",
        type: "link",
        href: "/",
      },
      {
        headline: "About",
        type: "link",
        href: "/about",
      },
      {
        headline: "Products",
        type: "content",
        content: {
          blocks: [],
        },
      },
      {
        headline: "Contact",
        type: "link",
        href: "/contact",
      },
    ],
  },
};

export const AccentTheme: Story = {
  args: {
    theme: "accent",
    headline: "Featured Content",
    isHero: false,
    tabs: [
      {
        headline: "Tab One",
        type: "content",
        content: {
          blocks: [],
        },
      },
      {
        headline: "Tab Two",
        type: "content",
        content: {
          blocks: [],
        },
      },
      {
        headline: "Tab Three",
        type: "content",
        content: {
          blocks: [],
        },
      },
    ],
  },
};

export const DarkTheme: Story = {
  args: {
    theme: "dark",
    headline: "Documentation",
    isHero: false,
    tabs: [
      {
        headline: "Getting Started",
        type: "content",
        content: {
          blocks: [],
        },
      },
      {
        headline: "Advanced",
        type: "content",
        content: {
          blocks: [],
        },
      },
      {
        headline: "API Reference",
        type: "link",
        href: "/docs/api",
      },
    ],
  },
};

export const ManyTabs: Story = {
  args: {
    theme: "light",
    headline: "Extended Tab Set",
    isHero: false,
    tabs: [
      { headline: "Tab 1", type: "content", content: { blocks: [] } },
      { headline: "Tab 2", type: "content", content: { blocks: [] } },
      { headline: "Tab 3", type: "content", content: { blocks: [] } },
      { headline: "Tab 4", type: "content", content: { blocks: [] } },
      { headline: "Tab 5", type: "content", content: { blocks: [] } },
      { headline: "Tab 6", type: "content", content: { blocks: [] } },
      { headline: "Tab 7", type: "content", content: { blocks: [] } },
      { headline: "Tab 8", type: "content", content: { blocks: [] } },
    ],
  },
};

export const AsMainHeading: Story = {
  args: {
    theme: "gradient",
    headline: "Headline",
    isHero: true,
    tabs: [
      {
        headline: "Tab 1",
        type: "content",
        content: {
          blocks: [],
        },
      },
      {
        headline: "Tab 2",
        type: "content",
        content: {
          blocks: [],
        },
      },
      {
        headline: "Tab 3",
        type: "content",
        content: {
          blocks: [],
        },
      },
    ],
  },
};
