<script setup lang="ts">
import PageHero from '../components/common/PageHero.vue'
import SearchField from '../components/common/SearchField.vue'
import StateMessage from '../components/common/StateMessage.vue'
import AppLayout from '../components/layout/AppLayout.vue'
import GenreSection from '../components/layout/GenreSection.vue'
import { useGenres } from '../composables/useGenres'
import { useShows } from '../composables/useShows'
import { useSearchStore } from '../stores/search'

const { data, isPending, isError, refetch } = useShows()
const genres = useGenres(data, { limitPerGenre: 12 })

useSearchStore().clear()
</script>

<template>
  <AppLayout>
    <PageHero
      eyebrow="Tonight on the dial"
      title="What are you in the mood for?"
      subtitle="Browse the listings by genre below — or start typing a title and we'll take you to the search desk."
      heading-id="hero-heading"
      size="large"
      class="hero"
    >
      <SearchField variant="hero" :autofocus="true" />
    </PageHero>

    <StateMessage v-if="isPending" headline="Cueing up tonight's listings…" />

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
  margin-bottom: var(--space-8);
}
</style>
