<script setup lang="ts">
import type { Show } from '../../types/show'
import ShowCard from './ShowCard.vue'

interface Props {
  shows: Show[]
  ariaLabel?: string
}

defineProps<Props>()
</script>

<template>
  <ul class="show-grid" role="list" :aria-label="ariaLabel">
    <li v-for="show in shows" :key="show.id">
      <ShowCard :show="show" />
    </li>
  </ul>
</template>

<style scoped>
.show-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-6);
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 768px) {
  .show-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}
</style>
