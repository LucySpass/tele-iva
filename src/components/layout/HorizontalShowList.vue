<script setup lang="ts">
import type { Show } from '../../types/show'
import ShowCard from '../common/ShowCard.vue'

interface Props {
  shows: Show[]
  ariaLabel?: string
}

defineProps<Props>()

function handleKey(event: KeyboardEvent) {
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
  const target = event.target as HTMLElement | null
  const item = target?.closest('.item')
  if (!item) return

  const sibling =
    event.key === 'ArrowRight'
      ? item.nextElementSibling
      : item.previousElementSibling
  const link = sibling?.querySelector<HTMLElement>('a')
  if (!link) return

  event.preventDefault()
  link.focus()
  link.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}
</script>

<template>
  <ul
    class="horizontal-list"
    role="list"
    :aria-label="ariaLabel"
    @keydown="handleKey"
  >
    <li v-for="show in shows" :key="show.id" class="item">
      <ShowCard :show="show" />
    </li>
  </ul>
</template>

<style scoped>
.horizontal-list {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
  overflow-y: visible;
  scroll-snap-type: x proximity;
  scroll-padding-inline: var(--space-6);
  padding: var(--space-2) var(--space-6);
  margin-inline: calc(-1 * var(--space-6));
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

.horizontal-list::-webkit-scrollbar {
  height: 6px;
}

.horizontal-list::-webkit-scrollbar-track {
  background: transparent;
}

.horizontal-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.item {
  flex: 0 0 auto;
  width: 200px;
  scroll-snap-align: start;
}

@media (min-width: 768px) {
  .item {
    width: 220px;
  }
}
</style>
