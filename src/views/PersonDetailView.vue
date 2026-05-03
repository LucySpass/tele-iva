<script setup lang="ts">
import { computed } from 'vue'

import BackLink from '../components/common/BackLink.vue'
import DetailHero from '../components/common/DetailHero.vue'
import ShowGrid from '../components/common/ShowGrid.vue'
import StateMessage from '../components/common/StateMessage.vue'
import AppLayout from '../components/layout/AppLayout.vue'
import { usePerson, usePersonCredits } from '../composables/usePerson'
import { variantFor } from '../utils/variant'
import type { Show } from '../types/show'

interface Props {
  id: string
}

const props = defineProps<Props>()

const { data: person, isPending, isError, refetch } = usePerson(() => props.id)
const { data: credits, isPending: creditsLoading } = usePersonCredits(() => props.id)

// Build the filmography from each credit's inline show. Dedupe by show id —
// an actor can have multiple character credits on the same show ("Self"
// credits coexist with named-character credits). Sort by rating-then-name so
// the most prominent work surfaces first; the API returns insertion order.
const filmography = computed<Show[]>(() => {
  const list = credits.value ?? []
  const seen = new Set<number>()
  const shows: Show[] = []
  for (const credit of list) {
    const show = credit._embedded?.show
    if (!show || seen.has(show.id)) continue
    seen.add(show.id)
    shows.push(show)
  }
  return shows.sort((a, b) => {
    const ra = a.rating.average ?? -Infinity
    const rb = b.rating.average ?? -Infinity
    if (rb !== ra) return rb - ra
    return a.name.localeCompare(b.name)
  })
})

const creditCount = computed(() => filmography.value.length)

const skeletonVariant = computed(() => {
  const id = person.value?.id ?? Number(props.id) ?? 0
  return variantFor(id)
})

const lifeDates = computed(() => {
  const p = person.value
  if (!p) return null
  if (!p.birthday && !p.deathday) return null
  const birth = p.birthday ?? '?'
  const death = p.deathday ?? null
  return death ? `${birth} – ${death}` : `b. ${birth}`
})
</script>

<template>
  <AppLayout>
    <StateMessage
      v-if="isPending"
      headline="Looking up the playbill…"
    />

    <StateMessage
      v-else-if="isError"
      role="alert"
      headline="We couldn't reach the actor's page."
      retry-label="Try again"
      @retry="refetch()"
    />

    <article v-else-if="person" class="person-detail">
      <BackLink />

      <DetailHero
        :image-src="person.image?.original ?? person.image?.medium ?? null"
        :image-alt="`Headshot of ${person.name}`"
        :variant="skeletonVariant"
        :title="person.name"
      >
        <template #eyebrow>Performer</template>

        <template v-if="person.country || lifeDates" #meta>
          <span v-if="person.country">{{ person.country.name }}</span>
          <span
            v-if="person.country && lifeDates"
            aria-hidden="true"
            class="meta-sep"
          >·</span>
          <span v-if="lifeDates">{{ lifeDates }}</span>
        </template>
      </DetailHero>

      <section class="filmography max-width" aria-labelledby="film-heading">
        <header class="film-head">
          <p class="eyebrow">Selected works</p>
          <h2 id="film-heading" class="section-title">Filmography</h2>
          <p v-if="creditCount" class="film-count">
            {{ creditCount }} {{ creditCount === 1 ? 'credit' : 'credits' }}
          </p>
        </header>

        <StateMessage
          v-if="creditsLoading && filmography.length === 0"
          size="compact"
          headline="Pulling the credits sheet…"
        />

        <StateMessage
          v-else-if="filmography.length === 0"
          size="compact"
          headline="No filmography on file."
        />

        <ShowGrid v-else :shows="filmography" />
      </section>
    </article>
  </AppLayout>
</template>

<style scoped>
.person-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.film-head {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin-bottom: var(--space-6);
}

.section-title {
  --section-color: var(--color-accent);
  font-size: var(--font-size-2xl);
  align-self: flex-start;
}

.film-count {
  margin: var(--space-2) 0 0;
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  color: var(--color-text-muted);
}
</style>
