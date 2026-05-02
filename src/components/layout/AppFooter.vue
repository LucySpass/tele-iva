<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';

const year = new Date().getFullYear()
const month = new Date().getMonth()

const socialLinks = [
  {
    href: 'https://github.com/LucySpass/tele-iva',
    label: 'GitHub repository',
    path:
      'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z',
  },
  {
    href: 'https://www.linkedin.com/in/ivana-begovic/',
    label: 'LinkedIn profile',
    path:
      'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.978 0 1.778-.773 1.778-1.729V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
] as const
</script>

<template>
  <footer class="app-footer">
    <p class="colophon">
      <span class="brand-line">Tele Iva</span>
      <span aria-hidden="true">·</span>
      <span>Vol. {{ month + 1 }} / {{ year }}</span>
    </p>

    <p class="credit">
      Show data courtesy of
      <a class="credit-link" href="https://www.tvmaze.com/api" target="_blank" rel="noopener noreferrer">TVMaze</a>
    </p>

    <ul class="social" aria-label="Find this project">
      <li v-for="link in socialLinks" :key="link.href">
        <NButton tag="a" :href="link.href" target="_blank" rel="noopener noreferrer" circle quaternary
          :aria-label="link.label">
          <template #icon>
            <NIcon>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path :d="link.path" />
              </svg>
            </NIcon>
          </template>
        </NButton>
      </li>
    </ul>
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-6);
  border-top: var(--border-width) solid var(--color-border);
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.colophon {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2);
  margin: 0;
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.brand-line {
  font-family: var(--font-display);
  font-size: var(--font-size-base);
  letter-spacing: var(--letter-spacing-normal);
  text-transform: none;
  color: var(--color-text);
}

.credit {
  margin: 0;
  font-style: italic;
  text-align: center;
}

.credit-link {
  color: var(--color-text);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.social {
  display: flex;
  gap: var(--space-1);
}

@media (max-width: 640px) {
  .app-footer {
    flex-direction: column;
    text-align: center;
    gap: var(--space-3);
  }
}
</style>
