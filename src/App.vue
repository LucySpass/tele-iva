<script setup lang="ts">
import { darkTheme, NConfigProvider } from 'naive-ui'
import { computed } from 'vue'
import { RouterView } from 'vue-router'

import { useThemeStore } from './stores/theme'
import { darkOverrides, lightOverrides } from './style/naive-theme'

const themeStore = useThemeStore()

const naiveTheme = computed(() =>
  themeStore.theme === 'dark' ? darkTheme : null,
)
const naiveOverrides = computed(() =>
  themeStore.theme === 'dark' ? darkOverrides : lightOverrides,
)
</script>

<template>
  <NConfigProvider :theme="naiveTheme" :theme-overrides="naiveOverrides">
    <RouterView />
  </NConfigProvider>
</template>
