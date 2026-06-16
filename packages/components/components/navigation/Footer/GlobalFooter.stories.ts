import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Footer as GlobalFooter } from "./index";

const meta = {
  title: "Navigation/GlobalFooter",
  component: GlobalFooter,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlobalFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
