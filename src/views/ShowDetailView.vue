<script setup lang="ts">
import { NTag } from 'naive-ui'
import { computed } from 'vue'

import CoverImage from '../components/common/CoverImage.vue'
import AppLayout from '../components/layout/AppLayout.vue'
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
      <header class="hero">
        <div class="cover">
          <CoverImage
            :src="show.image?.original ?? null"
            :alt="`${show.name} cover art`"
            :variant="skeletonVariant"
          />
        </div>

        <div class="masthead">
          <p class="eyebrow">
            <span>{{ show.type }}</span>
            <span v-if="show.language" aria-hidden="true">·</span>
            <span v-if="show.language">{{ show.language }}</span>
          </p>

          <h1 class="title">{{ show.name }}</h1>

          <p class="meta">
            <span v-if="ratingFormatted" class="rating" :aria-label="ratingLabel">
              <span aria-hidden="true">★</span> {{ ratingFormatted }}
            </span>
            <span v-if="ratingFormatted && year" aria-hidden="true" class="meta-sep">·</span>
            <span v-if="year">{{ year }}</span>
            <span aria-hidden="true" class="meta-sep">·</span>
            <span class="status">{{ show.status }}</span>
          </p>

          <ul v-if="show.genres.length" class="genres" :aria-label="genreLabel">
            <li v-for="genre in show.genres" :key="genre">
              <NTag size="small" :bordered="false">{{ genre }}</NTag>
            </li>
          </ul>
        </div>
      </header>

      <section v-if="show.summary" class="summary" aria-labelledby="summary-heading">
        <h2 id="summary-heading" class="section-title">Synopsis</h2>
        <!-- TVMaze returns sanitized HTML for summaries; safe to render. -->
        <div class="summary-body" v-html="show.summary"></div>
      </section>

      <section class="facts" aria-labelledby="facts-heading">
        <h2 id="facts-heading" class="section-title">On the dial</h2>
        <dl class="facts-list">
          <template v-if="network">
            <dt>Network</dt>
            <dd>{{ network }}</dd>
          </template>
          <template v-if="show.runtime">
            <dt>Runtime</dt>
            <dd>{{ show.runtime }} min</dd>
          </template>
          <template v-if="scheduleText">
            <dt>Schedule</dt>
            <dd>{{ scheduleText }}</dd>
          </template>
          <template v-if="show.premiered">
            <dt>Premiered</dt>
            <dd>{{ show.premiered }}</dd>
          </template>
          <template v-if="show.ended">
            <dt>Ended</dt>
            <dd>{{ show.ended }}</dd>
          </template>
          <template v-if="show.officialSite">
            <dt>Official site</dt>
            <dd>
              <a :href="show.officialSite" target="_blank" rel="noopener noreferrer">Visit</a>
            </dd>
          </template>
        </dl>
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
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  margin: 0 0 var(--space-2);
  color: var(--color-text);
}

.state-sub {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  margin: 0 0 var(--space-6);
  color: var(--color-text-muted);
}

.state-action {
  font-family: var(--font-body);
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
  gap: var(--space-12);
}

.hero {
  display: grid;
  gap: var(--space-8);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .hero {
    grid-template-columns: minmax(220px, 320px) 1fr;
    align-items: start;
    gap: var(--space-12);
  }
}

.cover {
  aspect-ratio: 3 / 4;
  border: var(--border-width) solid var(--color-border);
  overflow: hidden;
}

.masthead {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  color: var(--color-text-muted);
}

.title {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  margin: 0;
}

@media (min-width: 768px) {
  .title {
    font-size: var(--font-size-3xl);
  }
}

.meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--color-text-muted);
}

.rating {
  color: var(--color-text);
}

.meta-sep {
  color: var(--color-border);
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  padding: 0;
  margin: 0;
}

.genres li {
  list-style: none;
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-tight);
  margin: 0 0 var(--space-4);
  display: inline-block;
  border-bottom: var(--border-width-bold) solid var(--color-primary);
  padding-bottom: var(--space-1);
}

.summary {
  max-width: 65ch;
}

.summary-body {
  font-family: var(--font-body);
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

.facts-list {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--space-3) var(--space-6);
  margin: 0;
}

.facts-list dt {
  font-family: var(--font-body);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  color: var(--color-text-muted);
  align-self: baseline;
}

.facts-list dd {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  color: var(--color-text);
}

@media (max-width: 480px) {
  .facts-list {
    grid-template-columns: 1fr;
    gap: var(--space-1) 0;
  }

  .facts-list dt {
    margin-top: var(--space-3);
  }

  .facts-list dt:first-child {
    margin-top: 0;
  }
}
</style>
