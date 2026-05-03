<script setup lang="ts">
import { NButton } from 'naive-ui'
import { computed, onScopeDispose, ref, useId, useTemplateRef, watch } from 'vue'
import { RouterLink } from 'vue-router'

import CoverImage from '../common/CoverImage.vue'
import { useCast } from '../../composables/useCast'

interface Props {
  showId: number | string
  enabled: boolean
}

const props = defineProps<Props>()

const { data: cast, isPending, isError, refetch } = useCast(
  () => props.showId,
  () => props.enabled,
)

const skeletonVariants = ['primary', 'secondary', 'accent'] as const
function variantFor(personId: number) {
  return skeletonVariants[personId % 3]
}

function tiltFor(index: number) {
  return index % 2 === 0 ? '-1deg' : '1deg'
}

// Show two rows by default. The grid is `auto-fill, minmax(160px, 1fr)`
// with var(--space-4) gap, so column count is viewport-dependent — we
// measure the actual grid width to figure out how many cards make two
// rows on the current screen.
const CELL_MIN_WIDTH = 160
const GRID_GAP = 16 // var(--space-4)
const PREVIEW_ROWS = 2

const gridRef = useTemplateRef<HTMLUListElement>('gridRef')
const visibleCount = ref<number | null>(null)
const expanded = ref(false)
const gridId = useId()

function recomputeVisible(width: number) {
  const cols = Math.max(1, Math.floor((width + GRID_GAP) / (CELL_MIN_WIDTH + GRID_GAP)))
  visibleCount.value = cols * PREVIEW_ROWS
}

// Re-run when the grid element enters/leaves the DOM (conditional rendering
// means it doesn't exist during the loading state on a fresh page load).
let observer: ResizeObserver | null = null

watch(gridRef, (el) => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (!el) return
  recomputeVisible(el.getBoundingClientRect().width)
  observer = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (entry) recomputeVisible(entry.contentRect.width)
  })
  observer.observe(el)
})

onScopeDispose(() => observer?.disconnect())

const visibleCast = computed(() => {
  if (!cast.value) return []
  if (expanded.value || visibleCount.value === null) return cast.value
  return cast.value.slice(0, visibleCount.value)
})

const hasOverflow = computed(
  () =>
    cast.value !== undefined &&
    visibleCount.value !== null &&
    cast.value.length > visibleCount.value,
)
</script>

<template>
  <div class="cast">
    <p v-if="isPending" class="state" role="status">Tracking down the cast list…</p>

    <div v-else-if="isError" class="state" role="alert">
      <p>The cast roll seems to be missing.</p>
      <button type="button" class="state-action" @click="refetch()">Try again</button>
    </div>

    <p v-else-if="!cast || cast.length === 0" class="state subtle">
      No cast credits on file.
    </p>

    <template v-else>
      <ul :id="gridId" ref="gridRef" class="grid" role="list">
        <li
          v-for="(member, idx) in visibleCast"
          :key="`${member.person.id}-${member.character.id}`"
          class="cell"
          :style="{ '--tilt': tiltFor(idx) }"
        >
          <RouterLink
            :to="{ name: 'person-detail', params: { id: member.person.id } }"
            class="card"
            :aria-label="`${member.person.name} as ${member.character.name}`"
          >
            <div class="frame" :data-variant="variantFor(member.person.id)">
              <CoverImage
                :src="member.person.image?.medium ?? null"
                :alt="`Headshot of ${member.person.name}`"
                :variant="variantFor(member.person.id)"
              />
            </div>
            <div class="info">
              <p class="eyebrow">As</p>
              <p class="character">{{ member.character.name }}</p>
              <h3 class="name">{{ member.person.name }}</h3>
              <p v-if="member.voice" class="footnote">Voice</p>
              <p v-else-if="member.self" class="footnote">As themselves</p>
            </div>
          </RouterLink>
        </li>
      </ul>

      <div v-if="hasOverflow" class="more">
        <NButton
          text
          class="more-button"
          :aria-expanded="expanded"
          :aria-controls="gridId"
          @click="expanded = !expanded"
        >
          <span>{{ expanded ? 'Show less' : `Show all ${cast.length} cast members` }}</span>
          <span class="more-arrow" aria-hidden="true">{{ expanded ? '↑' : '↓' }}</span>
        </NButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cast {
  padding-block: var(--space-4);
}

.state {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  text-align: center;
  padding-block: var(--space-8);
  margin: 0;
}

.state.subtle {
  color: var(--color-text-muted);
}

.state-action {
  font-size: var(--font-size-sm);
  font-weight: 600;
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  color: var(--color-bg);
  background: var(--color-primary);
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-sm);
  margin-top: var(--space-3);
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-6) var(--space-4);
  margin: 0;
  padding: 0;
}

.cell {
  list-style: none;
  transform: rotate(var(--tilt));
  transition: transform var(--duration-base) var(--easing-standard);
}

.cell:hover,
.cell:focus-within {
  transform: rotate(0deg) translateY(-2px);
}

.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  text-decoration: none;
  color: inherit;
  border-radius: var(--radius-sm);
}

.card:focus-visible {
  outline: 3px solid var(--color-secondary);
  outline-offset: 4px;
}

.frame {
  aspect-ratio: 3 / 4;
  border: var(--border-width-bold) solid var(--color-border);
  overflow: hidden;
  position: relative;
}

.frame::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 6px;
  background: var(--frame-color);
}

.frame[data-variant='primary'] { --frame-color: var(--color-primary); }
.frame[data-variant='secondary'] { --frame-color: var(--color-secondary); }
.frame[data-variant='accent'] { --frame-color: var(--color-accent); }

.info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.eyebrow {
  margin: 0;
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  color: var(--color-text-muted);
}

.character {
  margin: 0;
  font-family: var(--font-body);
  font-style: italic;
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: var(--line-height-tight);
}

.name {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-tight);
}

.footnote {
  margin: var(--space-1) 0 0;
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  color: var(--color-text-muted);
}

.more {
  display: flex;
  justify-content: center;
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: var(--border-width) solid var(--color-border);
}

.more-button {
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: 600;
  letter-spacing: var(--letter-spacing-wide);
}

.more-arrow {
  display: inline-block;
  margin-inline-start: var(--space-2);
  transition: transform var(--duration-fast) var(--easing-standard);
}

.more-button:hover .more-arrow,
.more-button:focus-visible .more-arrow {
  transform: translateY(2px);
}
</style>
