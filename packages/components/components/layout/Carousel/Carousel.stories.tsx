import type { Meta, StoryObj } from '@storybook/nextjs';
import { Carousel } from '@repo/components';

const meta = {
  title: 'Layout/Carousel',
  component: Carousel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    headline: {
      control: 'text',
      description: 'Main headline for the carousel section',
    },
    headlineLevel: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'HTML heading level for the headline',
    },
    description: {
      control: 'text',
      description: 'Description text below the headline',
    },
    rowSize: {
      control: { type: 'range', min: 1, max: 6, step: 1 },
      description: 'Number of items to show per row on desktop',
    },
    navStyle: {
      control: 'select',
      options: ['arrows', 'dots', 'both', 'none'],
      description: 'Navigation style for the carousel',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark', 'accent', 'gradient', 'transparent-light', 'transparent-dark'],
      description: 'Theme for the carousel',
    },
    alignment: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment for headline and description',
    },
    inheritTheme: {
      control: 'boolean',
      description: 'Whether to inherit theme from parent',
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleCard = ({ title, content }: { title: string; content: string }) => (
  <div className="bg-white rounded-lg shadow-md p-6 h-48 flex flex-col justify-center items-center text-center border">
    <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600 text-sm">{content}</p>
  </div>
);

export const Default: Story = {
  args: {
    headline: 'Featured Content',
    description: 'Discover our amazing collection of content cards',
    children: [
      <SampleCard key={1} title="Card 1" content="First sample card content" />,
      <SampleCard key={2} title="Card 2" content="Second sample card content" />,
      <SampleCard key={3} title="Card 3" content="Third sample card content" />,
      <SampleCard key={4} title="Card 4" content="Fourth sample card content" />,
      <SampleCard key={5} title="Card 5" content="Fifth sample card content" />,
    ],
  },
};

export const WithArrows: Story = {
  args: {
    headline: 'Navigation with Arrows',
    navStyle: 'arrows',
    rowSize: 2,
    children: [
      <SampleCard key={1} title="Slide 1" content="Content with arrow navigation" />,
      <SampleCard key={2} title="Slide 2" content="Navigate using left/right arrows" />,
      <SampleCard key={3} title="Slide 3" content="Perfect for image galleries" />,
      <SampleCard key={4} title="Slide 4" content="Clean arrow-based navigation" />,
    ],
  },
};

export const WithDots: Story = {
  args: {
    headline: 'Navigation with Dots',
    navStyle: 'dots',
    rowSize: 2,
    children: [
      <SampleCard key={1} title="Slide 1" content="Content with dot navigation" />,
      <SampleCard key={2} title="Slide 2" content="Navigate using dots below" />,
      <SampleCard key={3} title="Slide 3" content="Great for testimonials" />,
      <SampleCard key={4} title="Slide 4" content="Clean dot-based navigation" />,
    ],
  },
};

export const WithBothNavigation: Story = {
  args: {
    headline: 'Both Arrows and Dots',
    navStyle: 'both',
    rowSize: 1,
    children: [
      <SampleCard key={1} title="Feature 1" content="Full navigation options" />,
      <SampleCard key={2} title="Feature 2" content="Both arrows and dots available" />,
      <SampleCard key={3} title="Feature 3" content="Maximum user control" />,
      <SampleCard key={4} title="Feature 4" content="Perfect for hero carousels" />,
    ],
  },
};

export const NoNavigation: Story = {
  args: {
    headline: 'Auto-scrolling Content',
    navStyle: 'none',
    rowSize: 3,
    children: [
      <SampleCard key={1} title="Item 1" content="No navigation controls" />,
      <SampleCard key={2} title="Item 2" content="Pure content display" />,
      <SampleCard key={3} title="Item 3" content="Clean presentation" />,
    ],
  },
};

export const SingleRow: Story = {
  args: {
    headline: 'Single Item Display',
    rowSize: 1,
    children: [
      <SampleCard key={1} title="Hero Content" content="Full-width single item showcase" />,
      <SampleCard key={2} title="Featured Story" content="Perfect for highlighting key content" />,
      <SampleCard key={3} title="Main Feature" content="Focus on one item at a time" />,
    ],
  },
};

export const ManyItems: Story = {
  args: {
    headline: 'Large Collection',
    rowSize: 4,
    children: [
      <SampleCard key={1} title="Product 1" content="Item description" />,
      <SampleCard key={2} title="Product 2" content="Item description" />,
      <SampleCard key={3} title="Product 3" content="Item description" />,
      <SampleCard key={4} title="Product 4" content="Item description" />,
      <SampleCard key={5} title="Product 5" content="Item description" />,
      <SampleCard key={6} title="Product 6" content="Item description" />,
      <SampleCard key={7} title="Product 7" content="Item description" />,
      <SampleCard key={8} title="Product 8" content="Item description" />,
    ],
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    headline: 'Dark Theme Carousel',
    description: 'Elegant dark presentation',
    children: [
      <SampleCard key={1} title="Dark Card 1" content="Styled for dark theme" />,
      <SampleCard key={2} title="Dark Card 2" content="Perfect contrast" />,
      <SampleCard key={3} title="Dark Card 3" content="Professional appearance" />,
    ],
  },
};

export const AccentTheme: Story = {
  args: {
    theme: 'accent',
    headline: 'Accent Theme Carousel',
    description: 'Vibrant accent colors',
    children: [
      <SampleCard key={1} title="Accent Card 1" content="Branded appearance" />,
      <SampleCard key={2} title="Accent Card 2" content="Company colors" />,
      <SampleCard key={3} title="Accent Card 3" content="Eye-catching design" />,
    ],
  },
};

export const CenterAligned: Story = {
  args: {
    headline: 'Center Aligned Content',
    description: 'All text centered for balance',
    alignment: 'center',
    children: [
      <SampleCard key={1} title="Centered 1" content="Balanced presentation" />,
      <SampleCard key={2} title="Centered 2" content="Symmetrical layout" />,
      <SampleCard key={3} title="Centered 3" content="Professional centering" />,
    ],
  },
};

export const RightAligned: Story = {
  args: {
    headline: 'Right Aligned Content',
    description: 'Text aligned to the right',
    alignment: 'right',
    children: [
      <SampleCard key={1} title="Right 1" content="Right-aligned text" />,
      <SampleCard key={2} title="Right 2" content="Alternative layout" />,
      <SampleCard key={3} title="Right 3" content="Unique positioning" />,
    ],
  },
};