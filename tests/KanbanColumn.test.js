import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KanbanColumn from '../src/components/KanbanColumn.vue'

const column = { id: 'todo', title: '待办', color: '#4f46e5' }

function makeTask(id, overrides = {}) {
  return {
    id,
    title: '任务' + id,
    description: '',
    category: '',
    columnId: 'todo',
    starred: false,
    urgent: false,
    createdAt: Date.now(),
    ...overrides
  }
}

describe('KanbanColumn', () => {
  it('渲染列标题与任务计数', () => {
    const wrapper = mount(KanbanColumn, {
      props: { column, taskList: [makeTask('a'), makeTask('b')] }
    })
    expect(wrapper.text()).toContain('待办')
    expect(wrapper.find('.kanban-column__count').text()).toBe('2')
  })

  it('空列时展示 EmptyState 引导', () => {
    const wrapper = mount(KanbanColumn, { props: { column, taskList: [] } })
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('非空时不展示 EmptyState', () => {
    const wrapper = mount(KanbanColumn, { props: { column, taskList: [makeTask('a')] } })
    expect(wrapper.find('.empty-state').exists()).toBe(false)
  })

  it('drop 事件解析 taskId 并触发 move(taskId, columnId)', async () => {
    const wrapper = mount(KanbanColumn, {
      props: { column, taskList: [makeTask('a')] }
    })
    const dataTransfer = { getData: () => 'a', dropEffect: '' }
    await wrapper.find('.kanban-column').trigger('drop', { dataTransfer })
    expect(wrapper.emitted('move')[0]).toEqual(['a', 'todo'])
  })

  it('dragover 阻止默认行为以允许放置', async () => {
    const wrapper = mount(KanbanColumn, { props: { column, taskList: [makeTask('a')] } })
    const event = { preventDefault: () => {}, dataTransfer: { dropEffect: '' } }
    await wrapper.find('.kanban-column').trigger('dragover', event)
    expect(wrapper.find('.kanban-column').classes()).toContain('kanban-column--over')
  })

  it('转发子卡片的 toggle 事件', async () => {
    const wrapper = mount(KanbanColumn, { props: { column, taskList: [makeTask('a')] } })
    await wrapper.find('.task-card__star').trigger('click')
    expect(wrapper.emitted('toggle')[0]).toEqual(['a', 'starred'])
  })

  it('转发子卡片的 remove 事件', async () => {
    const wrapper = mount(KanbanColumn, { props: { column, taskList: [makeTask('a')] } })
    await wrapper.find('.task-card__remove').trigger('click')
    expect(wrapper.emitted('remove')[0]).toEqual(['a'])
  })

  it('空列 EmptyState 的行动入口触发 add 事件', async () => {
    const wrapper = mount(KanbanColumn, { props: { column, taskList: [] } })
    await wrapper.find('.empty-state__action').trigger('click')
    expect(wrapper.emitted('add')).toBeTruthy()
  })
})