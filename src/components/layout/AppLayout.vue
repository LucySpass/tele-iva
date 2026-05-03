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
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <AppHeader />
    <main id="main-content" class="app-main">
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

.skip-link {
  position: absolute;
  top: 0;
  left: 0;
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-primary);
  color: var(--color-bg);
  font-weight: 600;
  text-decoration: none;
  transform: translateY(-100%);
  transition: transform var(--duration-fast) var(--easing-standard);
  z-index: 999;
}

.skip-link:focus {
  transform: translateY(0);
}
</style>
