import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DefaultFooter } from './index';

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