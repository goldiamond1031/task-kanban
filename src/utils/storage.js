const BOARD_KEY = 'task-kanban:board'
const THEME_KEY = 'task-kanban:theme'

export const BOARD_STORAGE_KEY = BOARD_KEY
export const THEME_STORAGE_KEY = THEME_KEY
export const SCHEMA_VERSION = 1

export const COLUMN_IDS = ['todo', 'doing', 'done']

export function createDefaultState() {
  return { tasks: [], version: SCHEMA_VERSION }
}

export function generateId() {
  return 't_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
}

function isValidColumn(id) {
  return COLUMN_IDS.indexOf(id) !== -1
}

function normalizeTask(raw) {
  if (!raw || typeof raw !== 'object') return null
  const title = typeof raw.title === 'string' ? raw.title.trim() : ''
  if (!title) return null
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : generateId(),
    title,
    description: typeof raw.description === 'string' ? raw.description : '',
    category: typeof raw.category === 'string' ? raw.category : '',
    columnId: isValidColumn(raw.columnId) ? raw.columnId : 'todo',
    starred: raw.starred === true,
    urgent: raw.urgent === true,
    createdAt: typeof raw.createdAt === 'number' && isFinite(raw.createdAt) ? raw.createdAt : Date.now()
  }
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(BOARD_KEY)
    if (!raw) return createDefaultState()
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.tasks)) {
      return createDefaultState()
    }
    const tasks = parsed.tasks.map(normalizeTask).filter(Boolean)
    return { tasks, version: SCHEMA_VERSION }
  } catch (err) {
    return createDefaultState()
  }
}

export function saveState(state) {
  try {
    const payload = {
      tasks: state && Array.isArray(state.tasks) ? state.tasks : [],
      version: SCHEMA_VERSION
    }
    window.localStorage.setItem(BOARD_KEY, JSON.stringify(payload))
    return true
  } catch (err) {
    return false
  }
}

export function loadTheme() {
  try {
    return window.localStorage.getItem(THEME_KEY)
  } catch (err) {
    return null
  }
}

export function saveTheme(id) {
  try {
    window.localStorage.setItem(THEME_KEY, id)
    return true
  } catch (err) {
    return false
  }
}