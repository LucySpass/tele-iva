/** Rotating color variants for skeleton loaders and accent bands. */
export const SKELETON_VARIANTS = ['primary', 'secondary', 'accent'] as const

export type SkeletonVariant = (typeof SKELETON_VARIANTS)[number]

/** Pick a deterministic variant based on a numeric id. */
export function variantFor(id: number): SkeletonVariant {
  // Modulo guarantees index is 0–2, but TS can't prove it
  return SKELETON_VARIANTS[id % SKELETON_VARIANTS.length] as SkeletonVariant
}
