import type { Preview } from '@storybook/nextjs-vite'
import '../../app-0/styles/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        light: {
          name: 'light',
          value: '#ffffff',
        },

        parchment: {
          name: 'parchment',
          value: '#eae4c8',
        },

        dark: {
          name: 'dark',
          value: '#121212',
        }
      }
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'light'
    }
  }
};

export default preview;