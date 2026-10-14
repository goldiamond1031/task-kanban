import { ref, computed } from 'vue'
import { loadState, saveState, generateId } from '../utils/storage'

export const TITLE_MAX_LENGTH = 100

export const COLUMNS = [
  { id: 'todo', title: '待办', color: 'var(--color-column-todo, #4f46e5)' },
  { id: 'doing', title: '进行中', color: 'var(--color-column-doing, #d69e2e)' },
  { id: 'done', title: '已完成', color: 'var(--color-column-done, #38a169)' }
]

const COLUMN_ID_SET = ['todo', 'doing', 'done']

const tasks = ref([])
const columns = ref(COLUMNS)
let initialized = false

function persist() {
  saveState({ tasks: tasks.value.map((t) => ({ ...t })), version: 1 })
}

export function initKanban() {
  if (initialized) return
  const state = loadState()
  tasks.value = state.tasks
  initialized = true
}

export function addTask(input) {
  const data = input || {}
  const title = typeof data.title === 'string' ? data.title.trim() : ''
  if (!title) return { ok: false, error: 'EMPTY_TITLE' }
  if (title.length > TITLE_MAX_LENGTH) return { ok: false, error: 'TITLE_TOO_LONG' }

  const task = {
    id: generateId(),
    title,
    description: typeof data.description === 'string' ? data.description.trim() : '',
    category: typeof data.category === 'string' ? data.category.trim() : '',
    columnId: COLUMN_ID_SET.indexOf(data.columnId) !== -1 ? data.columnId : 'todo',
    starred: false,
    urgent: false,
    createdAt: Date.now()
  }
  tasks.value.push(task)
  persist()
  return { ok: true, task }
}

export function removeTask(taskId) {
  const index = tasks.value.findIndex((t) => t.id === taskId)
  if (index === -1) return false
  tasks.value.splice(index, 1)
  persist()
  return true
}

export function moveTask(taskId, targetColumnId) {
  const task = tasks.value.find((t) => t.id === taskId)
  if (!task) return { moved: false, enteredDone: false }
  if (COLUMN_ID_SET.indexOf(targetColumnId) === -1) {
    return { moved: false, enteredDone: false }
  }
  if (task.columnId === targetColumnId) {
    return { moved: false, enteredDone: false }
  }
  const wasDone = task.columnId === 'done'
  task.columnId = targetColumnId
  persist()
  return { moved: true, enteredDone: !wasDone && targetColumnId === 'done' }
}

export function toggleStarred(taskId) {
  const task = tasks.value.find((t) => t.id === taskId)
  if (!task) return false
  task.starred = !task.starred
  persist()
  return task.starred
}

export function toggleUrgent(taskId) {
  const task = tasks.value.find((t) => t.id === taskId)
  if (!task) return false
  task.urgent = !task.urgent
  persist()
  return task.urgent
}

export function resetBoard() {
  tasks.value = []
  persist()
}

const columnTaskCache = {
  todo: computed(() => tasks.value.filter((t) => t.columnId === 'todo')),
  doing: computed(() => tasks.value.filter((t) => t.columnId === 'doing')),
  done: computed(() => tasks.value.filter((t) => t.columnId === 'done'))
}

export function tasksByColumn(columnId) {
  return columnTaskCache[columnId] || computed(() => [])
}

export const columnCounts = computed(() => {
  const counts = { todo: 0, doing: 0, done: 0 }
  tasks.value.forEach((t) => {
    if (counts[t.columnId] !== undefined) counts[t.columnId] += 1
  })
  return counts
})

export const existingCategories = computed(() => {
  const set = new Set()
  tasks.value.forEach((t) => {
    if (t.category) set.add(t.category)
  })
  return Array.from(set)
})

export function useKanban() {
  return {
    tasks,
    columns,
    initKanban,
    addTask,
    removeTask,
    moveTask,
    toggleStarred,
    toggleUrgent,
    resetBoard,
    tasksByColumn,
    columnCounts,
    existingCategories
  }
}