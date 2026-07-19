import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Breadcrumb } from "./index";

const meta: Meta<typeof Breadcrumb> = {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "About us", href: "/about-us" },
      { label: "Valarie Ballard" },
    ],
  },
};
