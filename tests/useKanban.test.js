import { describe, it, expect, beforeEach } from 'vitest'
import { useKanban } from '../src/composables/useKanban'

const kanban = useKanban()
const {
  tasks,
  columns,
  addTask,
  removeTask,
  moveTask,
  toggleStarred,
  toggleUrgent,
  resetBoard,
  tasksByColumn,
  columnCounts,
  existingCategories
} = kanban

beforeEach(() => {
  tasks.value = []
  window.localStorage.clear()
})

describe('useKanban', () => {
  it('默认提供三列看板', () => {
    expect(columns.value.map((c) => c.id)).toEqual(['todo', 'doing', 'done'])
  })

  it('标题为空时返回 EMPTY_TITLE 且不新增', () => {
    const res = addTask({ title: '   ' })
    expect(res).toEqual({ ok: false, error: 'EMPTY_TITLE' })
    expect(tasks.value).toHaveLength(0)
  })

  it('标题超长时返回 TITLE_TOO_LONG', () => {
    const res = addTask({ title: 'a'.repeat(101) })
    expect(res.ok).toBe(false)
    expect(res.error).toBe('TITLE_TOO_LONG')
  })

  it('创建任务应用默认值', () => {
    const res = addTask({ title: '新任务' })
    expect(res.ok).toBe(true)
    expect(res.task).toMatchObject({
      title: '新任务',
      columnId: 'todo',
      starred: false,
      urgent: false
    })
    expect(typeof res.task.id).toBe('string')
    expect(typeof res.task.createdAt).toBe('number')
    expect(tasks.value).toHaveLength(1)
  })

  it('创建时可指定列，非法列回退 todo', () => {
    const res = addTask({ title: 'X', columnId: 'bad' })
    expect(res.task.columnId).toBe('todo')
  })

  it('删除任务从集合中移除', () => {
    const res = addTask({ title: 'X' })
    expect(removeTask(res.task.id)).toBe(true)
    expect(tasks.value).toHaveLength(0)
    expect(removeTask('not-exist')).toBe(false)
  })

  it('拖拽到 done 列触发 enteredDone', () => {
    const res = addTask({ title: 'X' })
    const move = moveTask(res.task.id, 'done')
    expect(move).toEqual({ moved: true, enteredDone: true })
    expect(tasks.value[0].columnId).toBe('done')
  })

  it('同列移动不生效且不触发庆祝', () => {
    const res = addTask({ title: 'X' })
    expect(moveTask(res.task.id, 'todo')).toEqual({ moved: false, enteredDone: false })
  })

  it('已在 done 列的任务再次落入 done 不重复庆祝', () => {
    const res = addTask({ title: 'X', columnId: 'done' })
    expect(moveTask(res.task.id, 'done')).toEqual({ moved: false, enteredDone: false })
  })

  it('从 done 移出再进入 done 可再次庆祝', () => {
    const res = addTask({ title: 'X' })
    moveTask(res.task.id, 'done')
    moveTask(res.task.id, 'doing')
    expect(moveTask(res.task.id, 'done').enteredDone).toBe(true)
  })

  it('移动非法目标列不生效', () => {
    const res = addTask({ title: 'X' })
    expect(moveTask(res.task.id, 'nowhere')).toEqual({ moved: false, enteredDone: false })
  })

  it('星标与紧急标记可翻转', () => {
    const res = addTask({ title: 'X' })
    expect(toggleStarred(res.task.id)).toBe(true)
    expect(toggleStarred(res.task.id)).toBe(false)
    expect(toggleUrgent(res.task.id)).toBe(true)
    expect(tasks.value[0].urgent).toBe(true)
  })

  it('重置看板清空全部任务', () => {
    addTask({ title: 'A' })
    addTask({ title: 'B' })
    resetBoard()
    expect(tasks.value).toHaveLength(0)
  })

  it('tasksByColumn 按列过滤', () => {
    addTask({ title: 'A' })
    const b = addTask({ title: 'B' })
    moveTask(b.task.id, 'done')
    expect(tasksByColumn('todo').value).toHaveLength(1)
    expect(tasksByColumn('done').value).toHaveLength(1)
  })

  it('columnCounts 聚合各列数量', () => {
    const a = addTask({ title: 'A' })
    addTask({ title: 'B' })
    moveTask(a.task.id, 'doing')
    expect(columnCounts.value).toEqual({ todo: 1, doing: 1, done: 0 })
  })

  it('existingCategories 提取并去重非空分类', () => {
    addTask({ title: 'A', category: '开发' })
    addTask({ title: 'B', category: '开发' })
    addTask({ title: 'C', category: '设计' })
    addTask({ title: 'D' })
    expect(existingCategories.value.sort()).toEqual(['开发', '设计'])
  })

  it('操作后自动写入 localStorage', () => {
    addTask({ title: '持久化任务' })
    const raw = window.localStorage.getItem('task-kanban:board')
    expect(raw).toBeTruthy()
    expect(raw).toContain('持久化任务')
  })
})