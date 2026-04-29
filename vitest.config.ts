import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfigFn from './vite.config'

// vite.config exports a function form so it can branch on `command` for the
// GitHub Pages base path. Resolve it here with a serve/test context.
const viteConfig = await viteConfigFn({
  command: 'serve',
  mode: 'test',
})

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
