<script setup lang="ts">
import SearchField from '../components/common/SearchField.vue'
import StateMessage from '../components/common/StateMessage.vue'
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

    <StateMessage
      v-if="isPending"
      headline="Cueing up tonight's listings…"
    />

    <StateMessage
      v-else-if="isError"
      role="alert"
      headline="We couldn't reach the listings desk."
      retry-label="Try again"
      @retry="refetch()"
    />

    <StateMessage
      v-else-if="genres.length === 0"
      headline="Looks like a quiet night on TV."
    />

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

@media (max-width: 640px) {
  .hero-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
