// @ts-check
import { defineConfig, envField } from 'astro/config'

import sitemap from '@astrojs/sitemap'

import svelte from '@astrojs/svelte'

// https://astro.build/config
export default defineConfig({
  site: 'https://kaisermann.me',

  integrations: [sitemap(), svelte()],

  env: {
    schema: {
      SPOTIFY_CLIENT_SECRET: envField.string({
        default: '',
        access: 'secret',
        context: 'server',
      }),
      NODE_ENV: envField.string({
        default: 'development',
        access: 'public',
        context: 'server',
      }),
    },
  },
})
