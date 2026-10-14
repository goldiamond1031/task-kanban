import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Celebration from '../src/components/Celebration.vue'

function mockCanvas() {
  const ctx = {
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    bezierCurveTo: vi.fn()
  }
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ctx)
  return ctx
}

describe('Celebration', () => {
  beforeEach(() => {
    mockCanvas()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('prefers-reduced-motion 时跳过动画并立即 complete', async () => {
    window.matchMedia = () => ({ matches: true })
    const wrapper = mount(Celebration, { props: { visible: false } })
    await wrapper.setProps({ visible: true })
    expect(wrapper.emitted('complete')).toBeTruthy()
  })

  it('duration 到期后触发 complete', async () => {
    window.matchMedia = () => ({ matches: false })
    let rafCb = null
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCb = cb
      return 1
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    let now = 0
    vi.spyOn(performance, 'now').mockImplementation(() => now)

    const wrapper = mount(Celebration, { props: { visible: false, duration: 100 } })
    await wrapper.setProps({ visible: true })
    expect(typeof rafCb).toBe('function')

    now = 500
    rafCb(now)
    expect(wrapper.emitted('complete')).toBeTruthy()
  })

  it('卸载时释放动画帧资源', async () => {
    window.matchMedia = () => ({ matches: false })
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 7)
    const wrapper = mount(Celebration, { props: { visible: false } })
    await wrapper.setProps({ visible: true })
    wrapper.unmount()
    expect(cancelSpy).toHaveBeenCalled()
  })
})