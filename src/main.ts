import './style/tokens.css'
import './style/global.css'

import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')

if (import.meta.env.DEV || import.meta.env.PROD) {
  console.log(
    `%c TELE IVA %c\n\n` +
      `%cEST. 2026 %c\n\n` +
      `%c  " Your evening listings, now in pixels. "  %c\n\n` +
      `%c ▸ THE STACK %c\n` +
      `%c   Vue 3 + TypeScript + Vite\n` +
      `   Pinia · TanStack Vue Query · Naive UI\n` +
      `   Fuse.js fuzzy search · TVMaze API%c\n\n` +
      `%c ▸ THE LOOK %c\n` +
      `%c   Abril Fatface & Work Sans\n` +
      `   Warm cream & film-grain paper texture\n` +
      `   Light / Dark via CSS custom properties%c\n\n` +
      `%c ▸ THE EXTRAS %c\n` +
      `%c   Lazy routes · debounced search\n` +
      `   Keyboard-navigable horizontal lists\n` +
      `   Vitest + Vue Test Utils%c\n\n` +
      `%cgithub.com/LucySpass/tele-iva%c`,

    // TELE IVA badge
    'background:#E07A5F;color:#F4ECD8;font-family:Georgia,serif;font-size:28px;font-weight:bold;padding:6px 14px;border-radius:4px;letter-spacing:2px;',
    '',
    // EST. 2026 badge
    'background:#2A9D8F;color:#F4ECD8;font-family:sans-serif;font-size:12px;font-weight:700;padding:8px 12px;border-radius:4px;letter-spacing:3px;text-transform:uppercase;',
    '',
    // Tagline
    'color:#2B2118;font-family:Georgia,serif;font-size:13px;font-style:italic;background:#E9B949;padding:4px 8px;border-radius:2px;',
    '',
    // Section: THE STACK header
    'color:#E07A5F;font-family:sans-serif;font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;',
    '',
    // Section: THE STACK body
    'color:#6B5D4F;font-size:11px;line-height:1.8;',
    '',
    // Section: THE LOOK header
    'color:#2A9D8F;font-family:sans-serif;font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;',
    '',
    // Section: THE LOOK body
    'color:#6B5D4F;font-size:11px;line-height:1.8;',
    '',
    // Section: THE EXTRAS header
    'color:#E9B949;font-family:sans-serif;font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;',
    '',
    // Section: THE EXTRAS body
    'color:#6B5D4F;font-size:11px;line-height:1.8;',
    '',
    // Source link
    'color:#2A9D8F;font-size:11px;font-weight:700;text-decoration:underline;',
    '',
  )
}
