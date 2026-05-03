<script setup lang="ts">
import { NTable, NTabPane, NTabs, NTag } from 'naive-ui'
import { computed, ref, watch } from 'vue'

import BackLink from '../components/common/BackLink.vue'
import DetailHero from '../components/common/DetailHero.vue'
import AppLayout from '../components/layout/AppLayout.vue'
import CastTab from '../components/show/CastTab.vue'
import EpisodesTab from '../components/show/EpisodesTab.vue'
import { useShow } from '../composables/useShow'

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

const skeletonVariants = ['primary', 'secondary', 'accent'] as const
const skeletonVariant = computed(() => {
  const id = show.value?.id ?? Number(props.id) ?? 0
  return skeletonVariants[id % 3]
})

interface Fact {
  label: string
  value: string
  href?: string
}

// Tab activation drives lazy fetching: the composables only run their
// queries when their `enabled` flag flips true. Once a tab has been opened
// it stays "ever-activated" so re-clicking doesn't trigger a refetch dance.
const activeTab = ref<'cast' | 'episodes'>('cast')
const castEverActive = ref(true) // cast is the default tab on landing
const episodesEverActive = ref(false)

watch(activeTab, (next) => {
  if (next === 'cast') castEverActive.value = true
  if (next === 'episodes') episodesEverActive.value = true
})

// Color block under the active tab rotates per tab — Cast wears teal,
// Episodes wears gold. Drives the `--tab-bar-color` variable consumed by
// scoped CSS below.
const tabBarColor = computed(() =>
  activeTab.value === 'episodes' ? 'var(--color-secondary)' : 'var(--color-primary)',
)

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
    <p v-if="isPending" class="state" role="status">Pulling the show details…</p>

    <div v-else-if="isError" class="state" role="alert">
      <p class="state-headline">We couldn't reach the show.</p>
      <p class="state-sub">The page may have changed channels.</p>
      <button type="button" class="state-action" @click="refetch()">Try again</button>
    </div>

    <article v-else-if="show" class="show-detail">
      <BackLink />

      <DetailHero
        :image-src="show.image?.original ?? null"
        :image-alt="`${show.name} cover art`"
        :variant="skeletonVariant"
        :title="show.name"
        :tags-label="genreLabel"
      >
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
        <NTabs
          v-model:value="activeTab"
          type="line"
          size="large"
          animated
          class="show-tabs"
          :style="{ '--tab-bar-color': tabBarColor }"
        >
          <NTabPane name="cast" tab="Cast">
            <CastTab :show-id="show.id" :enabled="castEverActive" />
          </NTabPane>
          <NTabPane name="episodes" tab="Episodes">
            <EpisodesTab :show-id="show.id" :enabled="episodesEverActive" />
          </NTabPane>
        </NTabs>
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
.state {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  color: var(--color-text-muted);
  text-align: center;
  padding-block: var(--space-12);
  margin: 0;
}

.state-headline {
  font-size: var(--font-size-xl);
  margin: 0 0 var(--space-2);
  color: var(--color-text);
}

.state-sub {
  font-size: var(--font-size-base);
  margin: 0 0 var(--space-6);
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
  cursor: pointer;
}

.show-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.section-title {
  font-size: var(--font-size-xl);
  margin: 0 0 var(--space-4);
  display: inline-block;
  border-bottom: var(--border-width-bold) solid var(--color-primary);
  padding-bottom: var(--space-1);
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

/* Naive UI tabs, themed magazine-style: editorial display-serif labels,
   thick color block under the active tab. Color rotates per tab via
   :nth-child so Cast/Episodes feel like distinct magazine sections. */
.show-tabs :deep(.n-tabs-tab) {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: 400;
  letter-spacing: var(--letter-spacing-tight);
  padding: var(--space-3) var(--space-4);
}

.show-tabs :deep(.n-tabs-tab .n-tabs-tab__label) {
  font-family: var(--font-display);
}

.show-tabs :deep(.n-tabs-bar) {
  height: 4px;
  background: var(--tab-bar-color, var(--color-primary));
  transition: background var(--duration-base) var(--easing-standard);
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
