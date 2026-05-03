<script setup lang="ts">
import { NButton } from 'naive-ui'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

interface Props {
  to?: RouteLocationRaw
  label?: string
}

withDefaults(defineProps<Props>(), {
  to: '/',
  label: 'Back to dashboard',
})
</script>

<template>
  <RouterLink :to="to" custom v-slot="{ href, navigate }">
    <NButton
      tag="a"
      text
      size="small"
      :href="href"
      class="back-link"
      @click="navigate"
    >
      <span class="arrow" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </span>
      {{ label }}
    </NButton>
  </RouterLink>
</template>

<style scoped>
.back-link {
  align-self: flex-start;
  margin-inline-start: calc(var(--space-2) * -1);
}

.arrow {
  display: inline-flex;
  align-items: center;
  margin-inline-end: var(--space-1);
  transition: transform var(--duration-fast) var(--easing-standard);
}

.back-link:hover .arrow,
.back-link:focus-visible .arrow {
  transform: translateX(-3px);
}
</style>
