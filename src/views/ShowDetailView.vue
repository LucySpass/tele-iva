<script setup lang="ts">
import { NTable, NTag } from 'naive-ui'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BackLink from '../components/common/BackLink.vue'
import DetailHero from '../components/common/DetailHero.vue'
import StateMessage from '../components/common/StateMessage.vue'
import AppLayout from '../components/layout/AppLayout.vue'
import CastTab from '../components/show/CastTab.vue'
import EpisodesTab from '../components/show/EpisodesTab.vue'
import { useShow } from '../composables/useShow'
import { variantFor } from '../utils/variant'

interface Props {
  id: string
}

const props = defineProps<Props>()

const { data: show, isPending, isError, refetch } = useShow(() => props.id)

const year = computed(() => show.value?.premiered?.slice(0, 4) ?? null)

const ratingFormatted = computed(() => {
  const value = show.value?.rating.average
  return value !== null && value !== undefined ? value.toFixed(1) : null
})

const ratingLabel = computed(() => {
  const value = show.value?.rating.average
  return value !== null && value !== undefined
    ? `Rated ${value} out of 10`
    : 'Not yet rated'
})

const network = computed(
  () => show.value?.network?.name ?? show.value?.webChannel?.name ?? null,
)

const scheduleText = computed(() => {
  const schedule = show.value?.schedule
  if (!schedule) return null
  const days = schedule.days.join(', ')
  if (!days && !schedule.time) return null
  return [days, schedule.time].filter(Boolean).join(' at ')
})

const genreLabel = computed(() => {
  const genres = show.value?.genres ?? []
  return genres.length ? `Genres: ${genres.join(', ')}` : undefined
})

const skeletonVariant = computed(() => {
  const id = show.value?.id ?? Number(props.id) ?? 0
  return variantFor(id)
})

interface Fact {
  label: string
  value: string
  href?: string
}

const route = useRoute()
const router = useRouter()

const VALID_TABS = ['cast', 'episodes'] as const
type Tab = (typeof VALID_TABS)[number]

const TAB_LABELS: Record<Tab, string> = {
  cast: 'Cast',
  episodes: 'Episodes',
}

function parseTab(value: unknown): Tab {
  return typeof value === 'string' && VALID_TABS.includes(value as Tab)
    ? (value as Tab)
    : 'cast'
}

// Tab activation drives lazy fetching: the composables only run their
// queries when their `enabled` flag flips true. Once a tab has been opened
// it stays "ever-activated" so re-clicking doesn't trigger a refetch dance.
const activeTab = ref<Tab>(parseTab(route.query.tab))
const castEverActive = ref(activeTab.value === 'cast')
const episodesEverActive = ref(activeTab.value === 'episodes')

// Ensure ?tab= is always present in the URL on first load
if (!route.query.tab) {
  router.replace({ query: { ...route.query, tab: activeTab.value } })
}

watch(activeTab, (next) => {
  if (next === 'cast') castEverActive.value = true
  if (next === 'episodes') episodesEverActive.value = true
  // Reflect tab in URL without creating a history entry per click
  router.replace({ query: { ...route.query, tab: next } })
})

const facts = computed<Fact[]>(() => {
  const list: Fact[] = []
  const data = show.value
  if (!data) return list
  if (network.value) list.push({ label: 'Network', value: network.value })
  if (data.runtime) list.push({ label: 'Runtime', value: `${data.runtime} min` })
  if (scheduleText.value) list.push({ label: 'Schedule', value: scheduleText.value })
  if (data.premiered) list.push({ label: 'Premiered', value: data.premiered })
  if (data.ended) list.push({ label: 'Ended', value: data.ended })
  if (data.officialSite) list.push({ label: 'Official site', value: 'Visit', href: data.officialSite })
  return list
})
</script>

<template>
  <AppLayout>
    <StateMessage v-if="isPending" headline="Pulling the show details…" />

    <StateMessage v-else-if="isError" role="alert" headline="We couldn't reach the show."
      subtitle="The page may have changed channels." retry-label="Try again" @retry="refetch()" />

    <article v-else-if="show" class="show-detail">
      <BackLink />

      <DetailHero :image-src="show.image?.original ?? null" :image-alt="`${show.name} cover art`"
        :variant="skeletonVariant" :title="show.name" :tags-label="genreLabel">
        <template #eyebrow>
          <span>{{ show.type }}</span>
          <span v-if="show.language" aria-hidden="true">·</span>
          <span v-if="show.language">{{ show.language }}</span>
        </template>

        <template #meta>
          <span v-if="ratingFormatted" class="rating" :aria-label="ratingLabel">
            <span aria-hidden="true">★</span> {{ ratingFormatted }}
          </span>
          <span v-if="ratingFormatted && year" aria-hidden="true" class="meta-sep">·</span>
          <span v-if="year">{{ year }}</span>
          <span aria-hidden="true" class="meta-sep">·</span>
          <span>{{ show.status }}</span>
        </template>

        <template v-if="show.genres.length" #tags>
          <li v-for="genre in show.genres" :key="genre">
            <NTag size="small" :bordered="false">{{ genre }}</NTag>
          </li>
        </template>
      </DetailHero>

      <section v-if="show.summary" class="max-width" aria-labelledby="summary-heading">
        <h2 id="summary-heading" class="section-title">Synopsis</h2>
        <!-- TVMaze returns sanitized HTML for summaries; safe to render. -->
        <div class="summary-body" v-html="show.summary"></div>
      </section>

      <section class="tabs-section" aria-label="Cast and episodes">
        <div role="tablist" :class="['tab-list', `tab-list--${activeTab}`]">
          <button v-for="tab in VALID_TABS" :key="tab" role="tab" :aria-selected="activeTab === tab"
            :class="['tab-trigger', { active: activeTab === tab }]" @click="activeTab = tab">
            {{ TAB_LABELS[tab] }}
          </button>
        </div>

        <CastTab v-if="activeTab === 'cast'" role="tabpanel" :show-id="show.id" :enabled="castEverActive" />
        <EpisodesTab v-else role="tabpanel" :show-id="show.id" :enabled="episodesEverActive" />
      </section>

      <section v-if="facts.length" class="facts" aria-labelledby="facts-heading">
        <h2 id="facts-heading" class="section-title">On the dial</h2>
        <NTable :bordered="false" :bottom-bordered="false" size="small" class="max-width">
          <tbody>
            <tr v-for="fact in facts" :key="fact.label">
              <td scope="row" class="facts-key">{{ fact.label }}</td>
              <td class="facts-value">
                <a v-if="fact.href" :href="fact.href" target="_blank" rel="noopener noreferrer">{{ fact.value }}</a>
                <template v-else>{{ fact.value }}</template>
              </td>
            </tr>
          </tbody>
        </NTable>
      </section>
    </article>
  </AppLayout>
</template>

<style scoped>
.show-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.max-width {
  max-width: calc(var(--max-width-content) / 2);
}

.summary-body {
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text);
}

.summary-body :deep(p) {
  margin: 0 0 var(--space-4);
}

.summary-body :deep(p:last-child) {
  margin-bottom: 0;
}

.tabs-section {
  margin-block: var(--space-4);
}

.tab-list {
  display: flex;
  gap: var(--space-2);
  border-bottom: var(--border-width) solid var(--color-border);
  margin-bottom: var(--space-4);
}

.tab-list--cast {
  --tab-bar-color: var(--color-primary);
}

.tab-list--episodes {
  --tab-bar-color: var(--color-secondary);
}

.tab-trigger {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 400;
  letter-spacing: var(--letter-spacing-tight);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-muted);
  border-bottom: 4px solid transparent;
  margin-bottom: -1px;
  transition:
    color var(--duration-fast) var(--easing-standard),
    border-color var(--duration-fast) var(--easing-standard);
}

.tab-trigger:hover {
  color: var(--color-text);
}

.tab-trigger.active {
  color: var(--color-text);
  border-bottom-color: var(--tab-bar-color, var(--color-primary));
}

.facts-key {
  width: 12rem;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-muted);
  background-color: transparent;
}

.facts-value {
  font-size: var(--font-size-base);
  color: var(--color-text);
}

@media (max-width: 480px) {
  .facts-key {
    width: auto;
  }
}
</style>
