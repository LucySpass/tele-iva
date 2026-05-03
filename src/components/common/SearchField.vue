<script setup lang="ts">
import { NInput } from 'naive-ui'
import { onMounted, useTemplateRef } from 'vue'

import { useSearchStore } from '../../stores/search'

interface Props {
  placeholder?: string
  ariaLabel?: string
  label?: string
  autofocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search by title…',
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
  <label class="search-field" :aria-label="ariaLabel">
    <span class="eyebrow label">{{ label }}</span>

    <NInput
      ref="inputRef"
      v-model:value="store.query"
      type="text"
      size="large"
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

.search-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  max-width: var(--max-width-input);
}

.label {
  display: block;
}
</style>
