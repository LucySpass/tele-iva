<script setup lang="ts">
import SearchField from '../components/common/SearchField.vue'
import AppLayout from '../components/layout/AppLayout.vue'
import GenreSection from '../components/layout/GenreSection.vue'
import { useGenres } from '../composables/useGenres'
import { useShows } from '../composables/useShows'

const { data, isPending, isError, refetch } = useShows()
const genres = useGenres(data, { limitPerGenre: 12 })
</script>

<template>
  <AppLayout>
    <section class="hero" aria-labelledby="hero-heading">
      <p class="eyebrow">Tonight on the dial</p>
      <h1 id="hero-heading" class="hero-title">What are you in the mood for?</h1>
      <p class="hero-sub">
        Browse the listings by genre below — or start typing a title and we'll
        take you to the search desk.
      </p>
      <SearchField variant="hero" placeholder="Search by title…" label="Find a show" />
    </section>

    <p v-if="isPending" class="state" role="status">
      Cueing up tonight's listings…
    </p>

    <div v-else-if="isError" class="state" role="alert">
      <p class="state-headline">We couldn't reach the listings desk.</p>
      <button type="button" class="state-action" @click="refetch()">Try again</button>
    </div>

    <p v-else-if="genres.length === 0" class="state">
      Looks like a quiet night on TV.
    </p>

    <template v-else>
      <GenreSection
        v-for="(group, idx) in genres"
        :key="group.genre"
        :genre="group.genre"
        :shows="group.shows"
        :index="idx + 1"
      />
    </template>
  </AppLayout>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}

.hero-title {
  font-size: var(--font-size-3xl);
  margin: 0;
}

.hero-sub {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  max-width: 48ch;
  margin: 0 0 var(--space-3);
}

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
  margin: 0 0 var(--space-4);
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

@media (max-width: 640px) {
  .hero-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
