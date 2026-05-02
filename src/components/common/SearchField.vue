<script setup lang="ts">
import { NInput } from 'naive-ui'
import { onMounted, useTemplateRef } from 'vue'

import { useSearchStore } from '../../stores/search'

interface Props {
  variant?: 'compact' | 'hero'
  placeholder?: string
  ariaLabel?: string
  label?: string
  autofocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'compact',
  placeholder: 'Search shows…',
  ariaLabel: 'Search shows by title',
  label: 'Find a show',
  autofocus: false,
})

const store = useSearchStore()

const inputRef = useTemplateRef<InstanceType<typeof NInput>>('inputRef')

onMounted(() => {
  if (props.autofocus) inputRef.value?.focus()
})
</script>

<template>
  <label class="search-field" :data-variant="variant">
    <span v-if="variant === 'hero'" class="eyebrow label">{{ label }}</span>
    <span v-else class="sr-only">{{ ariaLabel }}</span>

    <NInput
      ref="inputRef"
      v-model:value="store.query"
      type="text"
      :size="variant === 'hero' ? 'large' : 'medium'"
      :placeholder="placeholder"
      clearable
      :input-props="{
        'aria-label': ariaLabel,
        autocomplete: 'off',
        autocapitalize: 'off',
        spellcheck: 'false',
        enterkeyhint: 'search',
      }"
    />
  </label>
</template>

<style scoped>
.search-field {
  display: block;
}

.search-field[data-variant='hero'] {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  max-width: 36rem;
}

.search-field[data-variant='compact'] {
  width: clamp(12rem, 28vw, 22rem);
}

.label {
  display: block;
}
</style>
