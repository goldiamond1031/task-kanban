export type ThemeId = 'light' | 'dark' | 'colorful'

export interface ThemePalette {
  id: ThemeId
  name: string
  vars: Record<string, string>
}

export const DEFAULT_THEME: ThemeId = 'light'

export const THEME_ORDER: ThemeId[] = ['light', 'dark', 'colorful']

export const THEMES: Record<ThemeId, ThemePalette> = {
  light: {
    id: 'light',
    name: '亮色',
    vars: {
      '--color-bg': '#eef1f6',
      '--color-surface': '#ffffff',
      '--color-surface-hover': '#f7f9fc',
      '--color-border': '#e2e8f0',
      '--color-text': '#1a202c',
      '--color-text-secondary': '#718096',
      '--color-primary': '#4f46e5',
      '--color-primary-hover': '#4338ca',
      '--color-primary-text': '#ffffff',
      '--color-star': '#f6ad55',
      '--color-urgent': '#e53e3e',
      '--color-shadow': 'rgba(15, 23, 42, 0.08)',
      '--color-column-todo': '#4f46e5',
      '--color-column-doing': '#d69e2e',
      '--color-column-done': '#38a169'
    }
  },
  dark: {
    id: 'dark',
    name: '暗色',
    vars: {
      '--color-bg': '#0f172a',
      '--color-surface': '#1e293b',
      '--color-surface-hover': '#273449',
      '--color-border': '#334155',
      '--color-text': '#e2e8f0',
      '--color-text-secondary': '#94a3b8',
      '--color-primary': '#6366f1',
      '--color-primary-hover': '#818cf8',
      '--color-primary-text': '#ffffff',
      '--color-star': '#f6ad55',
      '--color-urgent': '#f56565',
      '--color-shadow': 'rgba(0, 0, 0, 0.45)',
      '--color-column-todo': '#6366f1',
      '--color-column-doing': '#ecc94b',
      '--color-column-done': '#48bb78'
    }
  },
  colorful: {
    id: 'colorful',
    name: '多彩',
    vars: {
      '--color-bg': 'linear-gradient(135deg, #fef3f9 0%, #eef2ff 50%, #ecfeff 100%)',
      '--color-surface': '#ffffff',
      '--color-surface-hover': '#faf5ff',
      '--color-border': '#e9d8fd',
      '--color-text': '#3b0764',
      '--color-text-secondary': '#8b5cf6',
      '--color-primary': '#d946ef',
      '--color-primary-hover': '#c026d3',
      '--color-primary-text': '#ffffff',
      '--color-star': '#fbbf24',
      '--color-urgent': '#f43f5e',
      '--color-shadow': 'rgba(217, 70, 239, 0.15)',
      '--color-column-todo': '#d946ef',
      '--color-column-doing': '#f59e0b',
      '--color-column-done': '#10b981'
    }
  }
}