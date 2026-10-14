<script setup>
import { ref, computed, onMounted } from 'vue'
import { TITLE_MAX_LENGTH } from '../composables/useKanban'

const props = defineProps({
  columns: { type: Array, default: () => [] },
  existingCategories: { type: Array, default: () => [] }
})

const emit = defineEmits(['submit', 'close'])

const title = ref('')
const description = ref('')
const category = ref('')
const columnId = ref(props.columns.length ? props.columns[0].id : 'todo')
const error = ref('')
const showSuggestions = ref(false)
const titleInput = ref(null)

const suggestions = computed(() => {
  const unique = Array.from(new Set(props.existingCategories)).filter(Boolean)
  const keyword = category.value.trim().toLowerCase()
  if (!keyword) return unique.slice(0, 6)
  return unique.filter(
    (item) => item.toLowerCase().indexOf(keyword) !== -1 && item !== category.value.trim()
  )
})

function submit() {
  const trimmed = title.value.trim()
  if (!trimmed) {
    error.value = '请输入任务标题'
    return
  }
  if (trimmed.length > TITLE_MAX_LENGTH) {
    error.value = '标题长度不能超过 ' + TITLE_MAX_LENGTH + ' 个字符'
    return
  }
  error.value = ''
  emit('submit', {
    title: trimmed,
    description: description.value,
    category: category.value,
    columnId: columnId.value
  })
}

function close() {
  emit('close')
}

function pickCategory(value) {
  category.value = value
  showSuggestions.value = false
}

function onBackdrop() {
  close()
}

onMounted(() => {
  if (titleInput.value) titleInput.value.focus()
})
</script>

<template>
  <div class="modal-mask" @click.self="onBackdrop">
    <div class="modal" role="dialog" aria-modal="true" aria-label="新增任务">
      <header class="modal__head">
        <h2 class="modal__title">新增任务</h2>
        <button class="modal__close" aria-label="关闭" @click="close">✕</button>
      </header>

      <form class="modal__body" @submit.prevent="submit">
        <label class="field">
          <span class="field__label">标题 <em>*</em></span>
          <input
            ref="titleInput"
            v-model="title"
            class="field__input"
            :class="{ 'is-error': error }"
            type="text"
            placeholder="想做什么？"
            maxlength="120"
            @input="error = ''"
          />
          <span v-if="error" class="field__error">{{ error }}</span>
        </label>

        <label class="field">
          <span class="field__label">描述</span>
          <textarea
            v-model="description"
            class="field__input field__textarea"
            rows="3"
            placeholder="补充一些细节（可选）"
          ></textarea>
        </label>

        <label class="field">
          <span class="field__label">分类</span>
          <input
            v-model="category"
            class="field__input"
            type="text"
            placeholder="如：开发 / 设计 / 学习"
            @focus="showSuggestions = true"
            @blur="showSuggestions = false"
          />
          <ul v-if="showSuggestions && suggestions.length" class="field__suggestions">
            <li v-for="item in suggestions" :key="item">
              <button type="button" @mousedown.prevent="pickCategory(item)">
                {{ item }}
              </button>
            </li>
          </ul>
        </label>

        <label class="field">
          <span class="field__label">目标列</span>
          <select v-model="columnId" class="field__input">
            <option v-for="col in columns" :key="col.id" :value="col.id">{{ col.title }}</option>
          </select>
        </label>

        <footer class="modal__foot">
          <button type="button" class="app-button app-button--ghost" @click="close">取消</button>
          <button type="submit" class="app-button">保存任务</button>
        </footer>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  background: rgba(15, 23, 42, 0.5);
  z-index: var(--z-modal);
}

.modal {
  width: 100%;
  max-width: 440px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: pop-in var(--transition-base) ease-out;
}

.modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
}

.modal__close {
  font-size: 18px;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}

.modal__close:hover {
  color: var(--color-urgent);
}

.modal__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-lg);
}

.field {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.field__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.field__label em {
  color: var(--color-urgent);
  font-style: normal;
}

.field__input {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.field__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent);
}

.field__input.is-error {
  border-color: var(--color-urgent);
}

.field__textarea {
  resize: vertical;
}

.field__error {
  font-size: 12px;
  color: var(--color-urgent);
}

.field__suggestions {
  position: absolute;
  top: calc(100% + var(--space-xs));
  left: 0;
  right: 0;
  padding: var(--space-xs);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  z-index: 1;
}

.field__suggestions button {
  display: block;
  width: 100%;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  text-align: left;
}

.field__suggestions button:hover {
  background: var(--color-surface-hover);
}

.modal__foot {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-xs);
}
</style>