<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

type SkeletonVariant = 'primary' | 'secondary' | 'accent'

interface Props {
  src: string | null | undefined
  alt: string
  variant?: SkeletonVariant
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
})

const imgRef = ref<HTMLImageElement | null>(null)
const loaded = ref(false)
const errored = ref(false)

function syncFromComplete() {
  // When an image is already in the browser cache, the `load` event may have
  // fired before this component mounted/re-rendered. Reading `complete` +
  // `naturalHeight` lets us detect that and skip the fade.
  if (imgRef.value?.complete && imgRef.value.naturalHeight > 0) {
    loaded.value = true
  }
}

onMounted(syncFromComplete)

watch(
  () => props.src,
  () => {
    loaded.value = false
    errored.value = false
    nextTick(syncFromComplete)
  },
)
</script>

<template>
  <div class="cover" :class="{ 'is-loaded': loaded, 'is-errored': errored }">
    <template v-if="src && !errored">
      <div class="skeleton" :data-variant="variant" aria-hidden="true">
        <span class="skeleton-label">Tuning in</span>
      </div>
      <img
        ref="imgRef"
        :src="src"
        :alt="alt"
        loading="lazy"
        decoding="async"
        class="image"
        @load="loaded = true"
        @error="errored = true"
      />
    </template>
    <div v-else class="placeholder" aria-hidden="true">No cover</div>
  </div>
</template>

<style scoped>
.cover {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--color-surface-alt);
  overflow: hidden;
}

.skeleton {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity var(--duration-base) var(--easing-standard);
}

.skeleton[data-variant="primary"] {
  background: var(--color-primary);
  color: var(--color-bg);
}

.skeleton[data-variant="secondary"] {
  background: var(--color-secondary);
  color: var(--color-text);
}

.skeleton[data-variant="accent"] {
  background: var(--color-accent);
  color: var(--color-bg);
}

.skeleton-label {
  font-family: var(--font-body);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  animation: cover-pulse 1.6s ease-in-out infinite;
}

.is-loaded .skeleton {
  opacity: 0;
}

.image {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity var(--duration-base) var(--easing-standard);
}

.is-loaded .image {
  opacity: 1;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: var(--font-body);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  color: var(--color-text-muted);
}

@keyframes cover-pulse {
  0%, 100% {
    opacity: 0.65;
  }
  50% {
    opacity: 1;
  }
}
</style>
