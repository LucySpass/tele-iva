import type { GlobalThemeOverrides } from 'naive-ui'

// Mirror of the color tokens in src/style/tokens.css.
// Naive UI's seemly parser rejects `var(...)` and `color-mix(...)` for color
// props, so we duplicate the concrete values here and switch override objects
// based on the active theme. Keep in sync with tokens.css.
interface ThemeColors {
  bg: string
  surface: string
  surfaceAlt: string
  text: string
  textMuted: string
  border: string
  primary: string
  secondary: string
  accent: string
  error: string
  success: string
}

const lightColors: ThemeColors = {
  bg: '#F4ECD8',
  surface: '#EAE0CC',
  surfaceAlt: '#DDD0B5',
  text: '#2B2118',
  textMuted: '#6B5D4F',
  border: '#D4C5A8',
  primary: '#2A9D8F',
  secondary: '#E9B949',
  accent: '#E07A5F',
  error: '#C44536',
  success: '#588157',
}

const darkColors: ThemeColors = {
  bg: '#1A1410',
  surface: '#26201A',
  surfaceAlt: '#332B23',
  text: '#F4ECD8',
  textMuted: '#B8A88E',
  border: '#3D342A',
  primary: '#48C9B0',
  secondary: '#F4C95D',
  accent: '#FF8C70',
  error: '#E76F51',
  success: '#89B486',
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function blend(
  hex: string,
  towards: 'white' | 'black',
  amount: number,
): string {
  const [r, g, b] = hexToRgb(hex)
  const target = towards === 'white' ? 255 : 0
  const mix = (c: number) => Math.round(c + (target - c) * amount)
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
}

function buildOverrides(c: ThemeColors): GlobalThemeOverrides {
  return {
    common: {
      bodyColor: c.bg,
      cardColor: c.surface,
      modalColor: c.surface,
      popoverColor: c.surface,
      tableColor: c.surface,
      inputColor: c.surface,
      actionColor: c.surfaceAlt,
      hoverColor: c.surfaceAlt,

      textColorBase: c.text,
      textColor1: c.text,
      textColor2: c.text,
      textColor3: c.textMuted,
      textColorDisabled: c.textMuted,
      placeholderColor: c.textMuted,
      iconColor: c.textMuted,

      borderColor: c.border,
      dividerColor: c.border,

      primaryColor: c.primary,
      primaryColorHover: blend(c.primary, 'white', 0.12),
      primaryColorPressed: blend(c.primary, 'black', 0.12),
      primaryColorSuppl: c.primary,

      successColor: c.success,
      warningColor: c.secondary,
      errorColor: c.error,

      // Non-color props can still reference CSS vars — they pass straight
      // through to CSS without seemly parsing.
      fontFamily: 'var(--font-body)',
      fontFamilyMono: 'var(--font-body)',
      borderRadius: 'var(--radius-sm)',
      borderRadiusSmall: 'var(--radius-sm)',
    },
  }
}

export const lightOverrides = buildOverrides(lightColors)
export const darkOverrides = buildOverrides(darkColors)
