<script setup lang="ts">
import { computed } from 'vue'

import StateMessage from '../common/StateMessage.vue'
import { useEpisodes } from '../../composables/useEpisodes'
import { variantFor } from '../../utils/variant'
import type { Episode } from '../../types/show'

interface Props {
  showId: number | string
  enabled: boolean
}

const props = defineProps<Props>()

const {
  data: episodes,
  isPending,
  isFetching,
  isError,
  refetch,
} = useEpisodes(
  () => props.showId,
  () => props.enabled,
)

interface Season {
  number: number
  episodes: Episode[]
}

const seasons = computed<Season[]>(() => {
  if (!episodes.value) return []
  const grouped = new Map<number, Episode[]>()
  for (const ep of episodes.value) {
    const list = grouped.get(ep.season) ?? []
    list.push(ep)
    grouped.set(ep.season, list)
  }
  return Array.from(grouped.entries())
    .sort(([a], [b]) => a - b)
    .map(([number, eps]) => ({
      number,
      episodes: eps.sort((a, b) => (a.number ?? 0) - (b.number ?? 0)),
    }))
})

function formatNumber(n: number | null) {
  if (n === null) return '—'
  return String(n).padStart(2, '0')
}

function formatSeason(n: number) {
  return String(n).padStart(2, '0')
}

function formatDate(airdate: string | null) {
  if (!airdate) return null
  const date = new Date(airdate)
  if (Number.isNaN(date.valueOf())) return airdate
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function variantForSeason(seasonNumber: number) {
  return variantFor(seasonNumber - 1)
}
</script>

<template>
  <div class="episodes">
    <StateMessage
      v-if="isPending || isFetching"
      size="compact"
      headline="Pulling up the broadcast log…"
    />

    <StateMessage
      v-else-if="isError"
      size="compact"
      role="alert"
      headline="The episode listing went off-air."
      retry-label="Try again"
      @retry="refetch()"
    />

    <StateMessage
      v-else-if="seasons.length === 0"
      size="compact"
      headline="No episodes scheduled."
    />

    <div v-else class="seasons">
      <details
        v-for="season in seasons"
        :key="season.number"
        :data-variant="variantForSeason(season.number)"
        class="season"
      >
        <summary class="season-summary">
          <div class="season-head">
            <p class="season-eyebrow eyebrow">Season</p>
            <p class="season-number">{{ formatSeason(season.number) }}</p>
            <p class="season-count">
              {{ season.episodes.length }}
              {{ season.episodes.length === 1 ? 'episode' : 'episodes' }}
            </p>
          </div>
          <span class="season-arrow" aria-hidden="true">&#9662;</span>
        </summary>

        <ol class="ep-list" role="list">
          <li v-for="ep in season.episodes" :key="ep.id" class="ep">
            <span class="ep-number" aria-hidden="true">{{
              formatNumber(ep.number)
            }}</span>
            <span class="ep-title">{{ ep.name }}</span>
            <span v-if="formatDate(ep.airdate)" class="ep-date">
              {{ formatDate(ep.airdate) }}
            </span>
          </li>
        </ol>
      </details>
    </div>
  </div>
</template>

<style scoped>
.episodes {
  padding-block: var(--space-4);
}

.seasons {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* Each season reads --variant-color from the global [data-variant] rule
   and aliases it to --season-color for descendants that need it
   (header underline, big season number, arrow). */
.season {
  --season-color: var(--variant-color);
}

.season-summary {
  display: flex;
  align-items: end;
  gap: var(--space-4);
  padding-block: var(--space-2) var(--space-3);
  border-bottom: var(--border-width-bold) solid var(--season-color);
  cursor: pointer;
  list-style: none;
}

/* Hide the default disclosure triangle in all browsers */
.season-summary::-webkit-details-marker {
  display: none;
}
.season-summary::marker {
  content: '';
}

.season-arrow {
  color: var(--season-color);
  font-size: var(--font-size-xl);
  align-self: end;
  margin-bottom: var(--space-2);
  transition: transform var(--duration-fast) var(--easing-standard);
}

.season[open] .season-arrow {
  transform: rotate(180deg);
}

.season-head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: end;
  gap: var(--space-4);
  width: 100%;
}

.season-eyebrow {
  margin: 0;
  align-self: end;
  padding-bottom: var(--space-2);
}

.season-number {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--font-size-3xl);
  line-height: 0.9;
  color: var(--season-color);
}

.season-count {
  margin: 0;
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  color: var(--color-text-muted);
  align-self: end;
  padding-bottom: var(--space-2);
}

.ep-list {
  display: flex;
  flex-direction: column;
  margin: var(--space-3) 0 0;
  padding: 0;
  list-style: none;
}

.ep {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: baseline;
  gap: var(--space-4);
  padding: var(--space-3) 0;
  border-bottom: var(--border-width) solid var(--color-border);
}

.ep:last-child {
  border-bottom: none;
}

.ep-number {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  min-width: 2.5ch;
}

.ep-title {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
}

.ep-date {
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  color: var(--color-text-muted);
  white-space: nowrap;
}

@media (max-width: 480px) {
  .ep {
    grid-template-columns: auto 1fr;
    grid-template-areas:
      'number title'
      '.      date';
    row-gap: var(--space-1);
  }

  .ep-number {
    grid-area: number;
  }
  .ep-title {
    grid-area: title;
  }
  .ep-date {
    grid-area: date;
    justify-self: start;
  }
}
</style>
