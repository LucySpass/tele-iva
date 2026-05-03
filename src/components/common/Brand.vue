<template>
  <div class="brand">
    <span class="wordmark">Tele Iva</span>
    <span class="eyebrow">
      <span class="rule" aria-hidden="true"></span>
      Est. 2026
      <span class="rule" aria-hidden="true"></span>
    </span>
  </div>
</template>

<style scoped>
.brand {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  line-height: var(--line-height-tight);
  color: var(--color-text);
}

.wordmark {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  letter-spacing: var(--letter-spacing-tight);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: var(--letter-spacing-wider);
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.rule {
  width: var(--space-6);
  height: var(--border-width);
  background: currentColor;
}

@media (min-width: 768px) {
  .wordmark {
    font-size: var(--font-size-3xl);
  }
}
</style>
