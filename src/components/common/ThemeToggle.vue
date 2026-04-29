<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import { computed } from 'vue'

import { useThemeStore } from '../../stores/theme'

const themeStore = useThemeStore()

const isDark = computed(() => themeStore.theme === 'dark')
const label = computed(() => (isDark.value ? 'Switch to light theme' : 'Switch to dark theme'))
</script>

<template>
  <NButton circle quaternary :aria-label="label" @click="themeStore.toggle">
    <template #icon>
      <NIcon>
        <svg v-if="!isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </NIcon>
    </template>
  </NButton>
</template>
