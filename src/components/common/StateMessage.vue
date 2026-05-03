<script setup lang="ts">
import { NButton } from 'naive-ui'

interface Props {
  /** The main headline. Shown as display-serif text. */
  headline: string
  /** Optional supporting copy below the headline. */
  subtitle?: string
  /** Accessible role: 'status' for loading, 'alert' for errors. */
  role?: 'status' | 'alert'
  /** When provided, renders a retry button. */
  retryLabel?: string
  /** Visual weight: 'default' for page-level states, 'compact' for
   *  tab-level or inline states. */
  size?: 'default' | 'compact'
}

withDefaults(defineProps<Props>(), {
  role: 'status',
  size: 'default',
})

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="state-message" :class="{ compact: size === 'compact' }" :role="role">
    <p class="state-headline">{{ headline }}</p>
    <p v-if="subtitle" class="state-sub">{{ subtitle }}</p>
    <NButton v-if="retryLabel" type="primary" strong size="small" @click="$emit('retry')">
      {{ retryLabel }}
    </NButton>
  </div>
</template>

<style scoped>
.state-message {
  text-align: center;
  padding-block: var(--space-12);
}

.state-message.compact {
  padding-block: var(--space-8);
}

.state-headline {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  margin: 0;
}

.compact .state-headline {
  font-size: var(--font-size-lg);
}

.state-sub {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  margin: var(--space-2) 0 0;
}
</style>
