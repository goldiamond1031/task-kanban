import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskCard from '../src/components/TaskCard.vue'

function makeTask(overrides = {}) {
  return {
    id: 't1',
    title: '写设计文档',
    description: '描述内容',
    category: '开发',
    columnId: 'todo',
    starred: false,
    urgent: false,
    createdAt: Date.now(),
    ...overrides
  }
}

describe('TaskCard', () => {
  it('渲染标题、描述与分类标签', () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask() } })
    expect(wrapper.text()).toContain('写设计文档')
    expect(wrapper.text()).toContain('描述内容')
    expect(wrapper.text()).toContain('开发')
  })

  it('无分类时不渲染分类标签', () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask({ category: '' }) } })
    expect(wrapper.find('.task-card__category').exists()).toBe(false)
  })

  it('无描述时不渲染描述', () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask({ description: '' }) } })
    expect(wrapper.find('.task-card__desc').exists()).toBe(false)
  })

  it('点击星标触发 toggle(id, "starred")', async () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask() } })
    await wrapper.find('.task-card__star').trigger('click')
    expect(wrapper.emitted('toggle')[0]).toEqual(['t1', 'starred'])
  })

  it('点击紧急触发 toggle(id, "urgent")', async () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask() } })
    await wrapper.find('.task-card__urgent').trigger('click')
    expect(wrapper.emitted('toggle')[0]).toEqual(['t1', 'urgent'])
  })

  it('点击删除触发 remove(id)', async () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask() } })
    await wrapper.find('.task-card__remove').trigger('click')
    expect(wrapper.emitted('remove')[0]).toEqual(['t1'])
  })

  it('星标态应用高亮样式类', () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask({ starred: true, urgent: true }) } })
    expect(wrapper.classes()).toContain('task-card--starred')
    expect(wrapper.classes()).toContain('task-card--urgent')
  })

  it('卡片具备 draggable 属性', () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask() } })
    expect(wrapper.attributes('draggable')).toBe('true')
  })

  it('提供下一列时渲染“移至”兜底入口并触发 move', async () => {
    const wrapper = mount(TaskCard, {
      props: { task: makeTask(), nextColumnId: 'doing', nextColumnTitle: '进行中' }
    })
    const moveBtn = wrapper.find('.task-card__move')
    expect(moveBtn.exists()).toBe(true)
    await moveBtn.trigger('click')
    expect(wrapper.emitted('move')[0]).toEqual(['t1', 'doing'])
  })

  it('用户输入以纯文本渲染，不解析 HTML（XSS 防护）', () => {
    const wrapper = mount(TaskCard, {
      props: { task: makeTask({ title: '<img src=x onerror=alert(1)>' }) }
    })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.task-card__title').text()).toContain('<img')
  })
})