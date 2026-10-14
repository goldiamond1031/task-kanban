import { THEMES, DEFAULT_THEME, type ThemeId } from '../config/themes'

export function applyTheme(theme: ThemeId): void {
  if (typeof document === 'undefined') return
  const id: ThemeId = theme && theme in THEMES ? theme : DEFAULT_THEME
  const palette = THEMES[id]
  const root = document.documentElement
  root.setAttribute('data-theme', id)
  Object.keys(palette.vars).forEach((key) => {
    root.style.setProperty(key, palette.vars[key])
  })
}

export function getCssVariable(name: string): string {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}