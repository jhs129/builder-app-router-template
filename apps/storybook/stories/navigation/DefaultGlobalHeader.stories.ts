import type { Meta, StoryObj } from "@storybook/nextjs";
import { DefaultHeader as DefaultGlobalHeader } from "@repo/components";

const meta = {
  title: "Navigation/DefaultGlobalHeader",
  component: DefaultGlobalHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "DefaultGlobalHeader component that fetches navigation data from Builder.io and renders the GlobalHeader component. Note: This component uses Builder.io and may not render properly in Storybook preview.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DefaultGlobalHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Default DefaultGlobalHeader component that will fetch navigation data from Builder.io and fall back to default navigation if fetch fails.",
      },
    },
  },
};
