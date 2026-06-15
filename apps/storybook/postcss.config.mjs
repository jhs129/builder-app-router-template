/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {
      config: '../app-0/tailwind.config.js'
    },
    autoprefixer: {},
  },
}

export default config