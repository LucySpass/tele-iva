<script setup lang="ts">
import CoverImage from './CoverImage.vue'

interface Props {
  imageSrc: string | null
  imageAlt: string
  variant?: 'primary' | 'secondary' | 'accent'
  title: string
  /** Optional aria-label for the tags list, when the `tags` slot is used. */
  tagsLabel?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
})
</script>

<template>
  <header class="hero">
    <div class="frame" :data-variant="variant">
      <CoverImage :src="imageSrc" :alt="imageAlt" :variant="variant" />
    </div>

    <div class="masthead">
      <p v-if="$slots.eyebrow" class="eyebrow">
        <slot name="eyebrow" />
      </p>

      <h1 class="title">{{ title }}</h1>

      <p v-if="$slots.meta" class="meta">
        <slot name="meta" />
      </p>

      <ul v-if="$slots.tags" class="tags" :aria-label="tagsLabel">
        <slot name="tags" />
      </ul>
    </div>
  </header>
</template>

<style scoped>
.hero {
  display: grid;
  gap: var(--space-8);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .hero {
    grid-template-columns: minmax(220px, 300px) 1fr;
    align-items: end;
    gap: var(--space-12);
  }
}

.frame {
  aspect-ratio: 3 / 4;
  border: var(--border-width-bold) solid var(--color-border);
  overflow: hidden;
  position: relative;
}

/* Magazine pull: a colored band along the bottom of the frame, color-keyed
   to the variant so the photo feels intentionally placed rather than a
   stock stock-photo. */
.frame::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 8px;
  background: var(--variant-color);
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
}

.title {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
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
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--color-text-muted);
}

/* Slotted helpers: consumers can reach into our masthead with these well-
   known classes to get the magazine treatment without re-styling. */
:slotted(.meta-sep) {
  color: var(--color-border);
}

:slotted(.rating) {
  color: var(--color-text);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  padding: 0;
}
</style>
