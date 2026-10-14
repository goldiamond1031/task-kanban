import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  loadState,
  saveState,
  generateId,
  BOARD_STORAGE_KEY,
  createDefaultState
} from '../src/utils/storage.js'

function makeTask(overrides = {}) {
  return {
    id: 't1',
    title: '任务A',
    description: '',
    category: '',
    columnId: 'todo',
    starred: false,
    urgent: false,
    createdAt: 1,
    ...overrides
  }
}

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('无数据时返回默认空看板', () => {
    expect(loadState()).toEqual({ tasks: [], version: 1 })
  })

  it('保存后可完整读回', () => {
    saveState({ tasks: [makeTask()], version: 1 })
    const loaded = loadState()
    expect(loaded.tasks).toHaveLength(1)
    expect(loaded.tasks[0]).toMatchObject({ id: 't1', title: '任务A', columnId: 'todo' })
  })

  it('JSON 损坏时降级为默认空看板且不抛异常', () => {
    window.localStorage.setItem(BOARD_STORAGE_KEY, '{not-valid-json')
    expect(loadState()).toEqual({ tasks: [], version: 1 })
  })

  it('缺字段的旧数据按默认值补齐', () => {
    window.localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify({ tasks: [{ title: 'X' }] }))
    const loaded = loadState()
    expect(loaded.tasks[0]).toMatchObject({
      title: 'X',
      description: '',
      category: '',
      columnId: 'todo',
      starred: false,
      urgent: false
    })
    expect(typeof loaded.tasks[0].id).toBe('string')
    expect(typeof loaded.tasks[0].createdAt).toBe('number')
  })

  it('非法 columnId 归入 todo', () => {
    window.localStorage.setItem(
      BOARD_STORAGE_KEY,
      JSON.stringify({ tasks: [{ title: 'X', columnId: 'invalid' }] })
    )
    expect(loadState().tasks[0].columnId).toBe('todo')
  })

  it('空标题任务被过滤', () => {
    window.localStorage.setItem(
      BOARD_STORAGE_KEY,
      JSON.stringify({ tasks: [{ title: '   ' }, { title: 'ok' }] })
    )
    expect(loadState().tasks).toHaveLength(1)
  })

  it('tasks 非数组时整体降级', () => {
    window.localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify({ tasks: 'oops' }))
    expect(loadState()).toEqual({ tasks: [], version: 1 })
  })

  it('createDefaultState 返回空看板', () => {
    expect(createDefaultState()).toEqual({ tasks: [], version: 1 })
  })

  it('generateId 生成唯一 id', () => {
    const set = new Set()
    for (let i = 0; i < 200; i += 1) set.add(generateId())
    expect(set.size).toBe(200)
  })

  it('写入失败时静默返回 false 且不抛异常', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    let result
    expect(() => {
      result = saveState({ tasks: [], version: 1 })
    }).not.toThrow()
    expect(result).toBe(false)
    spy.mockRestore()
  })
})