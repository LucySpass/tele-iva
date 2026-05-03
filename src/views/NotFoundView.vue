<script setup lang="ts">
import { NButton } from 'naive-ui'
import { RouterLink } from 'vue-router'

import AppLayout from '../components/layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <article class="not-found">
      <p class="eyebrow">Channel not found</p>
      <p class="error-code">404</p>

      <h1 class="headline">We've lost the signal.</h1>
      <p class="subhead">
        You've tuned to a frequency we don't broadcast on. Try adjusting the
        dial — or head back to the main listings.
      </p>

      <div class="test-pattern" aria-hidden="true">
        <span class="bar bar--primary"></span>
        <span class="bar bar--secondary"></span>
        <span class="bar bar--accent"></span>
        <span class="bar bar--primary"></span>
        <span class="bar bar--secondary"></span>
        <span class="bar bar--accent"></span>
        <span class="bar bar--primary"></span>
      </div>

      <nav class="actions" aria-label="Recovery options">
        <RouterLink :to="{ name: 'dashboard' }" custom v-slot="{ navigate }">
          <NButton type="primary" size="large" @click="navigate">
            Back to the listings
          </NButton>
        </RouterLink>
        <RouterLink :to="{ name: 'search' }" custom v-slot="{ navigate }">
          <NButton size="large" secondary @click="navigate">
            Try the search desk
          </NButton>
        </RouterLink>
      </nav>
    </article>
  </AppLayout>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-6);
  padding-block: var(--space-12);
}

.error-code {
  font-family: var(--font-display);
  font-size: clamp(6rem, 20vw, 12rem);
  line-height: 0.85;
  color: var(--color-accent);
  letter-spacing: -0.04em;
}

.headline {
  font-size: var(--font-size-2xl);
}

.subhead {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  line-height: var(--line-height-normal);
}

.test-pattern {
  display: flex;
  width: 100%;
  max-width: 400px;
  height: 12px;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.bar {
  flex: 1;
}

.bar--primary {
  background: var(--color-primary);
}

.bar--secondary {
  background: var(--color-secondary);
}

.bar--accent {
  background: var(--color-accent);
}

.actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;
}
</style>
