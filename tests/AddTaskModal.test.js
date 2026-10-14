import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AddTaskModal from '../src/components/AddTaskModal.vue'

const columns = [
  { id: 'todo', title: '待办' },
  { id: 'doing', title: '进行中' },
  { id: 'done', title: '已完成' }
]

describe('AddTaskModal', () => {
  it('标题为空时不提交并显示错误', async () => {
    const wrapper = mount(AddTaskModal, { props: { columns, existingCategories: [] } })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('请输入任务标题')
  })

  it('纯空白标题不提交', async () => {
    const wrapper = mount(AddTaskModal, { props: { columns, existingCategories: [] } })
    await wrapper.find('input[type="text"]').setValue('    ')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('超长标题不提交并提示长度超限', async () => {
    const wrapper = mount(AddTaskModal, { props: { columns, existingCategories: [] } })
    await wrapper.find('input[type="text"]').setValue('a'.repeat(101))
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('100')
  })

  it('有效提交时携带完整数据', async () => {
    const wrapper = mount(AddTaskModal, { props: { columns, existingCategories: [] } })
    const inputs = wrapper.findAll('input[type="text"]')
    await inputs[0].setValue('  新任务  ')
    await wrapper.find('textarea').setValue('描述')
    await wrapper.find('select').setValue('doing')
    await wrapper.find('form').trigger('submit')
    const payload = wrapper.emitted('submit')[0][0]
    expect(payload.title).toBe('新任务')
    expect(payload.description).toBe('描述')
    expect(payload.columnId).toBe('doing')
  })

  it('点击取消触发 close 事件', async () => {
    const wrapper = mount(AddTaskModal, { props: { columns, existingCategories: [] } })
    const buttons = wrapper.findAll('button')
    const cancel = buttons.find((b) => b.text() === '取消')
    await cancel.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('聚焦分类输入时展示已有分类建议并支持选择', async () => {
    const wrapper = mount(AddTaskModal, {
      props: { columns, existingCategories: ['开发', '设计'] }
    })
    const categoryInput = wrapper.findAll('input[type="text"]')[1]
    await categoryInput.trigger('focus')
    const suggestions = wrapper.findAll('.field__suggestions button')
    expect(suggestions.length).toBeGreaterThan(0)
    await suggestions[0].trigger('mousedown')
    expect(categoryInput.element.value).toBe('开发')
  })

  it('分类输入按关键字过滤建议', async () => {
    const wrapper = mount(AddTaskModal, {
      props: { columns, existingCategories: ['开发', '设计'] }
    })
    const categoryInput = wrapper.findAll('input[type="text"]')[1]
    await categoryInput.setValue('开')
    await categoryInput.trigger('focus')
    const suggestions = wrapper.findAll('.field__suggestions button')
    expect(suggestions.length).toBe(1)
    expect(suggestions[0].text()).toBe('开发')
  })

  it('用户输入以纯文本保存，不解析 HTML', async () => {
    const wrapper = mount(AddTaskModal, { props: { columns, existingCategories: [] } })
    const inputs = wrapper.findAll('input[type="text"]')
    await inputs[0].setValue('<b>加粗</b>')
    await wrapper.find('form').trigger('submit')
    const payload = wrapper.emitted('submit')[0][0]
    expect(payload.title).toBe('<b>加粗</b>')
    expect(wrapper.find('b').exists()).toBe(false)
  })
})