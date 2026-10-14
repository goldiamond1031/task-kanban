import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useToast, clearToasts } from '../src/composables/useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    clearToasts()
  })

  afterEach(() => {
    clearToasts()
    vi.useRealTimers()
  })

  it('show 入队一条提示并携带文案', () => {
    const { toasts, show } = useToast()
    show('add')
    expect(toasts.value).toHaveLength(1)
    expect(typeof toasts.value[0].message).toBe('string')
    expect(toasts.value[0].message.length).toBeGreaterThan(0)
  })

  it('倒计时到期后自动消失', () => {
    const { toasts, show } = useToast()
    show('add', 1000)
    expect(toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(1200)
    expect(toasts.value).toHaveLength(0)
  })

  it('支持多条提示并存堆叠', () => {
    const { toasts, show } = useToast()
    show('add')
    show('move')
    show('star')
    expect(toasts.value).toHaveLength(3)
  })

  it('悬停暂停倒计时，移开后继续', () => {
    const { toasts, show, pause, resume } = useToast()
    show('add', 1000)
    const id = toasts.value[0].id
    vi.advanceTimersByTime(400)
    pause(id)
    vi.advanceTimersByTime(5000)
    expect(toasts.value).toHaveLength(1)
    resume(id)
    vi.advanceTimersByTime(1000)
    expect(toasts.value).toHaveLength(0)
  })

  it('remove 可立即移除指定提示', () => {
    const { toasts, show, remove } = useToast()
    show('add')
    const id = toasts.value[0].id
    remove(id)
    expect(toasts.value).toHaveLength(0)
  })

  it('clear 清空全部提示', () => {
    const { toasts, show, clear } = useToast()
    show('add')
    show('move')
    clear()
    expect(toasts.value).toHaveLength(0)
  })
})