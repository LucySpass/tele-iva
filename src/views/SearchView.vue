<script setup lang="ts">
import { computed } from 'vue'

import BackLink from '../components/common/BackLink.vue'
import SearchField from '../components/common/SearchField.vue'
import ShowCard from '../components/common/ShowCard.vue'
import StateMessage from '../components/common/StateMessage.vue'
import AppLayout from '../components/layout/AppLayout.vue'
import { useSearch } from '../composables/useSearch'
import { useShows } from '../composables/useShows'
import { useSearchStore } from '../stores/search'

const store = useSearchStore()
const { data, isPending, isError, refetch } = useShows()

// Name-only search per the brief; threshold 0.3 forgives typos without
// drifting into nonsense matches. Limit keeps the DOM modest on broad terms.
const results = useSearch(data, () => store.debouncedQuery, {
  keys: ['name'],
  threshold: 0.3,
  limit: 60,
})

const trimmedQuery = computed(() => store.debouncedQuery.trim())
const hasQuery = computed(() => trimmedQuery.value.length > 0)
const resultCountLabel = computed(() => {
  if (!hasQuery.value) return ''
  const n = results.value.length
  if (n === 0) return `No shows found for "${trimmedQuery.value}".`
  return `${n} ${n === 1 ? 'result' : 'results'} for "${trimmedQuery.value}".`
})
</script>

<template>
  <AppLayout>
    <section class="search" aria-labelledby="search-heading">
      <BackLink @click="store.clear()" />

      <header class="search-head">
        <p class="eyebrow">Find a show</p>
        <h1 id="search-heading" class="search-title">Search the listings</h1>
        <p class="search-sub">
          Type a title — partial spellings are forgiven.
        </p>
      </header>

      <SearchField variant="hero" :autofocus="true" placeholder="What are we hunting for?" label="Search by title" />

      <p v-if="resultCountLabel" class="result-count" role="status" aria-live="polite">
        {{ resultCountLabel }}
      </p>

      <StateMessage
        v-if="isPending && hasQuery"
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
        v-else-if="!hasQuery"
        headline="Start typing — your results will appear here."
      />

      <StateMessage
        v-else-if="results.length === 0"
        headline="Nothing matches that title. Try a different spelling?"
      />

      <ul v-else class="results" role="list" :aria-label="`Search results for ${trimmedQuery}`">
        <li v-for="show in results" :key="show.id" class="result-item">
          <ShowCard :show="show" />
        </li>
      </ul>
    </section>
  </AppLayout>
</template>

<style scoped>
.search {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.search-head {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 32rem;
}

.search-title {
  font-size: var(--font-size-2xl);
  margin: 0;
}

.search-sub {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}

.result-count {
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  color: var(--color-text-muted);
  margin: 0;
}

.results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-6);
  margin: 0;
  padding: 0;
}

@media (min-width: 768px) {
  .results {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}
</style>
