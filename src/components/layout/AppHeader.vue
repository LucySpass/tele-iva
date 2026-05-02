<script setup lang="ts">
import { NButton } from 'naive-ui'
import { RouterLink, useRouter } from 'vue-router'

import Brand from '../common/Brand.vue'
import ThemeToggle from '../common/ThemeToggle.vue'

interface NavItem {
  to: string
  label: string
}

const router = useRouter()

const navItems: NavItem[] = router.options.routes.flatMap((route) => {
  const nav = route.meta?.nav
  return nav ? [{ to: route.path, label: nav.label }] : []
})
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="brand-link" aria-label="Tele Iva — back to dashboard">
      <Brand />
    </RouterLink>

    <nav class="primary-nav" aria-label="Primary">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        custom
        v-slot="{ href, navigate, isActive }"
      >
        <NButton
          tag="a"
          text
          :href="href"
          class="nav-link"
          :class="{ 'is-active': isActive }"
          @click="navigate"
        >
          {{ item.label }}
        </NButton>
      </RouterLink>
    </nav>

    <div class="actions">
      <ThemeToggle />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  border-bottom: var(--border-width) solid var(--color-border);
  background: var(--color-bg);
}

.brand-link {
  justify-self: start;
  text-decoration: none;
  color: inherit;
  border-radius: var(--radius-sm);
}

.brand-link:focus-visible {
  outline: 3px solid var(--color-secondary);
  outline-offset: 4px;
}

.primary-nav {
  display: flex;
  gap: var(--space-6);
  justify-self: center;
}

.nav-link {
  font-size: var(--font-size-sm);
  font-weight: 600;
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  border-bottom: var(--border-width-bold) solid transparent;
}

.nav-link.is-active {
  border-bottom-color: var(--color-primary);
}

.actions {
  justify-self: end;
}

@media (max-width: 640px) {
  .app-header {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "brand actions"
      "nav nav";
    row-gap: var(--space-3);
  }

  .brand-link { grid-area: brand; }
  .actions { grid-area: actions; }

  .primary-nav {
    grid-area: nav;
    justify-self: stretch;
    justify-content: center;
    border-top: var(--border-width) solid var(--color-border);
    padding-top: var(--space-3);
  }
}
</style>
