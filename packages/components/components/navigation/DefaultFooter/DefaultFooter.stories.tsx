import type { Meta, StoryObj } from '@storybook/nextjs';
import { DefaultFooter } from '@repo/components';

const meta = {
  title: 'Navigation/DefaultFooter',
  component: DefaultFooter,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DefaultFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};