import { ref } from 'vue'
import { applyTheme } from '../utils/cssVariables'
import { loadTheme, saveTheme } from '../utils/storage'
import { THEMES, THEME_ORDER, DEFAULT_THEME, type ThemeId } from '../config/themes'

function normalizeTheme(id: unknown): ThemeId {
  return typeof id === 'string' && id in THEMES ? (id as ThemeId) : DEFAULT_THEME
}

const currentTheme = ref<ThemeId>(normalizeTheme(loadTheme()))

applyTheme(currentTheme.value)

export function setTheme(id: ThemeId): void {
  const next = normalizeTheme(id)
  currentTheme.value = next
  applyTheme(next)
  saveTheme(next)
}

export function previewTheme(id: ThemeId): void {
  applyTheme(normalizeTheme(id))
}

export function cancelPreview(): void {
  applyTheme(currentTheme.value)
}

export function cycleTheme(): ThemeId {
  const index = THEME_ORDER.indexOf(currentTheme.value)
  const next = THEME_ORDER[(index + 1) % THEME_ORDER.length]
  setTheme(next)
  return next
}

export function useTheme() {
  return {
    currentTheme,
    setTheme,
    previewTheme,
    cancelPreview,
    cycleTheme
  }
}