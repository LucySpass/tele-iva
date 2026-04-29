import { copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig, type PluginOption } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// GitHub Pages serves a 404.html when no static file matches the URL — that's
// the SPA fallback hook. Copying dist/index.html → dist/404.html lets us keep
// createWebHistory routes (no /#/ in the URL) on Pages without server config.
function spaFallback404(): PluginOption {
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    closeBundle() {
      const distRoot = fileURLToPath(new URL('./dist', import.meta.url))
      const indexPath = `${distRoot}/index.html`
      const fallbackPath = `${distRoot}/404.html`
      if (existsSync(indexPath)) {
        copyFileSync(indexPath, fallbackPath)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GH Pages serves the app at https://<user>.github.io/tele-iva/, so production
  // assets need that base prefix. Dev server stays at root for normal DX.
  base: command === 'build' ? '/tele-iva/' : '/',
  plugins: [
    vue(),
    vueDevTools(),
    spaFallback404(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
