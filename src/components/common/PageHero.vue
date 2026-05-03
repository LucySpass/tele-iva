<script setup lang="ts">
interface Props {
  eyebrow: string
  title: string
  subtitle?: string
  headingId?: string
  /** Controls the title size. 'large' for dashboard, 'default' for inner pages. */
  size?: 'large' | 'default'
}

withDefaults(defineProps<Props>(), {
  size: 'default',
})
</script>

<template>
  <header class="page-hero" :class="[`page-hero--${size}`]">
    <p class="eyebrow">{{ eyebrow }}</p>
    <h1 :id="headingId" class="page-hero__title">{{ title }}</h1>
    <p v-if="subtitle" class="page-hero__sub">{{ subtitle }}</p>
    <slot />
  </header>
</template>

<style scoped>
.page-hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.page-hero__title {
  margin: 0;
}

.page-hero--large .page-hero__title {
  font-size: var(--font-size-3xl);
}

.page-hero--default .page-hero__title {
  font-size: var(--font-size-2xl);
}

.page-hero__sub {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  max-width: 48ch;
  margin: 0 0 var(--space-3);
}

.page-hero--default .page-hero__sub {
  font-size: var(--font-size-sm);
  margin: 0;
}

@media (max-width: 640px) {
  .page-hero--large .page-hero__title {
    font-size: var(--font-size-2xl);
  }
}
</style>
