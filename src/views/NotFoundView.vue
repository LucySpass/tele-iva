<script setup lang="ts">
import { NButton } from 'naive-ui'
import { RouterLink } from 'vue-router'

import AppLayout from '../components/layout/AppLayout.vue'

const channels = [
  { freq: '87.5', label: 'Static' },
  { freq: '91.3', label: 'Dead air' },
  { freq: '104.7', label: 'Nothing' },
  { freq: '108.0', label: '???' },
]
</script>

<template>
  <AppLayout>
    <article class="not-found">
      <div class="dial">
        <p class="channel-label eyebrow">Channel not found</p>
        <p class="error-code">404</p>
        <div class="static-bar" aria-hidden="true">
          <span v-for="ch in channels" :key="ch.freq" class="freq">
            {{ ch.freq }} — {{ ch.label }}
          </span>
        </div>
      </div>

      <div class="editorial">
        <h1 class="headline">We've lost the signal.</h1>
        <p class="subhead">
          You've tuned to a frequency we don't broadcast on. Try adjusting the
          dial — or head back to the main listings.
        </p>
      </div>

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

      <p class="fine-print">
        If you think this channel should exist, please check the antenna — or
        blame the intern.
      </p>
    </article>
  </AppLayout>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-8);
  padding-block: var(--space-12);
}

/* --- Dial / frequency display --- */

.dial {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.channel-label {
  margin: 0;
}

.error-code {
  font-family: var(--font-display);
  font-size: clamp(6rem, 20vw, 12rem);
  line-height: 0.85;
  color: var(--color-accent);
  margin: 0;
  letter-spacing: -0.04em;
}

.static-bar {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
  border-top: 2px solid var(--color-border);
  border-bottom: 2px solid var(--color-border);
}

.freq {
  font-family: var(--font-body);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  color: var(--color-text-muted);
}

/* --- Editorial copy --- */

.editorial {
  max-width: 480px;
}

.headline {
  font-size: var(--font-size-2xl);
  margin: 0 0 var(--space-3);
}

.subhead {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  line-height: var(--line-height-normal);
  margin: 0;
}

/* --- TV test-pattern color bars --- */

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

/* --- Actions --- */

.actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;
}

/* --- Fine print --- */

.fine-print {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-style: italic;
  margin: 0;
}
</style>
