<script setup lang="ts">
import { NCollapse, NCollapseItem } from 'naive-ui'
import { computed, ref } from 'vue'

import StateMessage from '../common/StateMessage.vue'
import { useEpisodes } from '../../composables/useEpisodes'
import type { Episode } from '../../types/show'

interface Props {
  showId: number | string
  enabled: boolean
}

const props = defineProps<Props>()

const { data: episodes, isPending, isFetching, isError, refetch } = useEpisodes(
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

// All collapsed by default — users click to expand the season they want.
const expandedSeasons = ref<number[]>([])

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

const seasonVariants = ['primary', 'secondary', 'accent'] as const
function variantFor(seasonNumber: number) {
  return seasonVariants[(seasonNumber - 1) % 3]
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

    <NCollapse
      v-else
      v-model:expanded-names="expandedSeasons"
      arrow-placement="right"
      class="seasons"
    >
      <NCollapseItem
        v-for="season in seasons"
        :key="season.number"
        :name="season.number"
        :data-variant="variantFor(season.number)"
        class="season"
      >
        <template #header>
          <div class="season-head">
            <p class="season-eyebrow">Season</p>
            <p class="season-number">{{ formatSeason(season.number) }}</p>
            <p class="season-count">
              {{ season.episodes.length }}
              {{ season.episodes.length === 1 ? 'episode' : 'episodes' }}
            </p>
          </div>
        </template>

        <ol class="ep-list" role="list">
          <li v-for="ep in season.episodes" :key="ep.id" class="ep">
            <span class="ep-number" aria-hidden="true">{{ formatNumber(ep.number) }}</span>
            <span class="ep-title">{{ ep.name }}</span>
            <span v-if="formatDate(ep.airdate)" class="ep-date">
              {{ formatDate(ep.airdate) }}
            </span>
          </li>
        </ol>
      </NCollapseItem>
    </NCollapse>
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

/* Each season carries its color via a custom property; descendants
   (header underline, big season number, expand chevron) all read from it. */
.season[data-variant='primary'] { --season-color: var(--color-primary); }
.season[data-variant='secondary'] { --season-color: var(--color-secondary); }
.season[data-variant='accent'] { --season-color: var(--color-accent); }

/* Strip the divider Naive UI puts between sibling collapse items — the
   per-season colored underline does the work instead. */
.seasons :deep(.n-collapse-item) {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.seasons :deep(.n-collapse-item__header) {
  padding-block: var(--space-2) var(--space-3);
  border-bottom: var(--border-width-bold) solid var(--season-color);
}

.seasons :deep(.n-collapse-item__header-main) {
  width: 100%;
}

.seasons :deep(.n-collapse-item__arrow) {
  color: var(--season-color);
  font-size: var(--font-size-lg);
  align-self: end;
  margin-bottom: var(--space-2);
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
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  color: var(--color-text-muted);
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
      "number title"
      ".      date";
    row-gap: var(--space-1);
  }

  .ep-number { grid-area: number; }
  .ep-title { grid-area: title; }
  .ep-date { grid-area: date; justify-self: start; }
}
</style>
