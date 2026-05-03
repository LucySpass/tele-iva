import { describe, expect, it } from 'vitest'

import { SKELETON_VARIANTS, variantFor } from '../../utils/variant'

describe('variantFor', () => {
  it('returns primary for index 0', () => {
    expect(variantFor(0)).toBe('primary')
  })

  it('returns secondary for index 1', () => {
    expect(variantFor(1)).toBe('secondary')
  })

  it('returns accent for index 2', () => {
    expect(variantFor(2)).toBe('accent')
  })

  it('cycles back to primary at index 3', () => {
    expect(variantFor(3)).toBe('primary')
  })

  it('handles large numbers', () => {
    expect(SKELETON_VARIANTS).toContain(variantFor(9999))
  })
})
