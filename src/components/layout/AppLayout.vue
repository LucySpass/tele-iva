<script setup lang="ts">
import { useSearchNavigation } from '../../composables/useSearchNavigation'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'

// Single mount point for URL ↔ search-store wiring. Must live above
// <RouterView /> so it stays alive across route changes.
useSearchNavigation()
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <main class="app-main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}
</style>
