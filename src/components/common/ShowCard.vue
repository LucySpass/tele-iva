<script setup lang="ts">
import { NCard, NTag } from 'naive-ui'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import type { Show } from '../../types/show'
import CoverImage from './CoverImage.vue'

interface Props {
  show: Show
}

const props = defineProps<Props>()

const year = computed(() => props.show.premiered?.slice(0, 4) ?? null)

const ratingFormatted = computed(() => {
  const value = props.show.rating.average
  return value !== null ? value.toFixed(1) : null
})

const ratingLabel = computed(() => {
  const value = props.show.rating.average
  return value !== null ? `Rated ${value} out of 10` : 'Not yet rated'
})

const genrePreview = computed(() => props.show.genres.slice(0, 3))
const genreLabel = computed(() =>
  props.show.genres.length ? `Genres: ${props.show.genres.join(', ')}` : undefined,
)

const skeletonVariants = ['primary', 'secondary', 'accent'] as const
const skeletonVariant = computed(() => skeletonVariants[props.show.id % 3])
</script>

<template>
  <RouterLink
    :to="{ name: 'show-detail', params: { id: show.id } }"
    class="show-card-link"
    :aria-label="show.name"
  >
    <NCard tag="article" class="show-card" bordered>
      <template #cover>
        <div class="cover">
          <CoverImage
            :src="show.image?.medium ?? null"
            :alt="`${show.name} cover art`"
            :variant="skeletonVariant"
          />
        </div>
      </template>

      <header class="head">
        <h3 class="title">{{ show.name }}</h3>
        <p class="meta">
          <span v-if="ratingFormatted" class="rating" :aria-label="ratingLabel">
            <span aria-hidden="true">★</span> {{ ratingFormatted }}
          </span>
          <span v-if="ratingFormatted && year" aria-hidden="true" class="meta-sep">·</span>
          <span v-if="year" class="year">{{ year }}</span>
        </p>
      </header>

      <ul v-if="genrePreview.length" class="genres" :aria-label="genreLabel">
        <li v-for="genre in genrePreview" :key="genre">
          <NTag size="small" :bordered="false">{{ genre }}</NTag>
        </li>
      </ul>
    </NCard>
  </RouterLink>
</template>

<style scoped>
.show-card-link {
  display: block;
  color: inherit;
  text-decoration: none;
  border-radius: var(--radius-sm);
  height: 100%;
}

.show-card-link:focus-visible {
  outline: 3px solid var(--color-secondary);
  outline-offset: 4px;
}

.show-card {
  height: 100%;
  transition:
    transform var(--duration-base) var(--easing-standard),
    background-color var(--duration-base) var(--easing-standard);
}

.show-card-link:hover .show-card,
.show-card-link:focus-visible .show-card {
  transform: translateY(-2px) rotate(1deg);
  background-color: var(--color-surface-alt);
}

.cover {
  aspect-ratio: 3 / 4;
}

.head {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.title {
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-tight);
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--font-size-xs);
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
  margin: var(--space-3) 0 0;
  padding: 0;
}

.genres li {
  list-style: none;
}
</style>
