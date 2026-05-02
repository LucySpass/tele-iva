<script setup lang="ts">
import { computed } from 'vue'

import type { Show } from '../../types/show'
import HorizontalShowList from './HorizontalShowList.vue'

interface Props {
  genre: string
  shows: Show[]
  index: number
}

const props = defineProps<Props>()

const paddedIndex = computed(() => String(props.index).padStart(2, '0'))
const colorIndex = computed(() => (props.index - 1) % 3)
const headingId = computed(() => `genre-${props.genre.toLowerCase().replace(/\s+/g, '-')}`)
</script>

<template>
  <section class="genre-section" :aria-labelledby="headingId">
    <header class="genre-header">
      <h2 :id="headingId" class="title-block" :data-color="colorIndex">
        <span class="number" aria-hidden="true">{{ paddedIndex }}</span>
        <span class="label">{{ genre }}</span>
      </h2>
    </header>
    <HorizontalShowList :shows="shows" :aria-label="`${genre} shows`" />
  </section>
</template>

<style scoped>
.genre-section {
  margin-block-end: var(--space-12);
}

.genre-section:last-child {
  margin-block-end: 0;
}

.genre-header {
  margin-block-end: var(--space-4);
}

.title-block {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-3);
  margin: 0;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-xl);
  letter-spacing: var(--letter-spacing-tight);
}

.title-block[data-color="0"] {
  background: var(--color-primary);
  color: var(--color-bg);
}

.title-block[data-color="1"] {
  background: var(--color-secondary);
  color: var(--color-text);
}

.title-block[data-color="2"] {
  background: var(--color-accent);
  color: var(--color-bg);
}

.number {
  font-size: var(--font-size-2xl);
  opacity: 0.85;
}

@media (min-width: 768px) {
  .title-block {
    font-size: var(--font-size-2xl);
  }

  .number {
    font-size: var(--font-size-3xl);
  }
}
</style>
