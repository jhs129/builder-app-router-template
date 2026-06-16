import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  "stories": [
    "../../../packages/components/components/**/*.mdx",
    "../../../packages/components/components/**/*.stories.@(ts|tsx)"
  ],
  "addons": [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-onboarding")
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ],
  // Silence benign Rollup noise: shared components ship a Next.js "use client"
  // directive that Rollup (via Vite) doesn't understand and strips when bundling
  // for Storybook. The directive is irrelevant here since Storybook renders
  // everything client-side. We filter only that warning and the sourcemap-
  // resolution warning it triggers, leaving all other warnings intact.
  async viteFinal(config) {
    config.build = config.build ?? {};
    config.build.rollupOptions = config.build.rollupOptions ?? {};
    const originalOnWarn = config.build.rollupOptions.onwarn;
    config.build.rollupOptions.onwarn = (warning, warn) => {
      if (
        warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
        typeof warning.message === 'string' &&
        warning.message.includes('use client')
      ) {
        return;
      }
      if (
        warning.code === 'SOURCEMAP_ERROR' &&
        typeof warning.message === 'string' &&
        warning.message.includes("Can't resolve original location of error")
      ) {
        return;
      }
      if (originalOnWarn) {
        originalOnWarn(warning, warn);
      } else {
        warn(warning);
      }
    };
    return config;
  }
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}