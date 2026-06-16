import type { Meta, StoryObj } from "@storybook/nextjs";
import { Alert } from "@repo/components";

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A flexible alert component that supports different variants, themes, and interactive features like dismissing and auto-hiding.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["info", "success", "warning", "error"],
      description: "The visual style variant of the alert",
    },
    theme: {
      control: { type: "select" },
      options: ["light", "dark", "accent", "gradient", "transparent-light", "transparent-dark"],
      description: "The theme to apply to the alert",
    },
    title: {
      control: "text",
      description: "Optional title for the alert",
    },
    message: {
      control: "text",
      description: "The main message content of the alert",
    },
    dismissible: {
      control: "boolean",
      description: "Whether the alert can be dismissed by the user",
    },
    autoHide: {
      control: "boolean",
      description: "Whether the alert should automatically hide after a delay",
    },
    autoHideDelay: {
      control: { type: "number", min: 1000, max: 10000, step: 500 },
      description: "Delay in milliseconds before auto-hiding",
    },
    icon: {
      control: "text",
      description: "Custom icon to display (overrides default variant icon)",
    },
    inheritTheme: {
      control: "boolean",
      description: "Inherit theme from parent component instead of using explicit theme",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for custom styling",
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: "info",
    message: "This is an informational alert message.",
    theme: "light",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    message: "Your action was completed successfully!",
    theme: "light",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    message: "Please be aware of this important information.",
    theme: "light",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    message: "An error occurred while processing your request.",
    theme: "light",
  },
};

export const WithTitle: Story = {
  args: {
    variant: "info",
    title: "Important Notice",
    message: "This alert includes both a title and a message.",
    theme: "light",
  },
};

export const NotDismissible: Story = {
  args: {
    variant: "warning",
    message: "This alert cannot be dismissed by the user.",
    dismissible: false,
    theme: "light",
  },
};

export const AutoHide: Story = {
  args: {
    variant: "success",
    message: "This alert will automatically hide after 3 seconds.",
    autoHide: true,
    autoHideDelay: 3000,
    theme: "light",
  },
};

export const CustomIcon: Story = {
  args: {
    variant: "info",
    message: "This alert uses a custom icon instead of the default.",
    icon: "🚀",
    theme: "light",
  },
};

export const DarkTheme: Story = {
  args: {
    variant: "info",
    title: "Dark Theme Alert",
    message: "This alert is displayed with the dark theme.",
    theme: "dark",
  },
};

export const AccentTheme: Story = {
  args: {
    variant: "success",
    title: "Accent Theme Alert",
    message: "This alert is displayed with the accent theme.",
    theme: "accent",
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="space-y-4 w-full max-w-2xl">
      <Alert {...args} variant="info" message="Info alert message" />
      <Alert {...args} variant="success" message="Success alert message" />
      <Alert {...args} variant="warning" message="Warning alert message" />
      <Alert {...args} variant="error" message="Error alert message" />
    </div>
  ),
  args: {
    theme: "light",
    message: "Default message",
  },
};