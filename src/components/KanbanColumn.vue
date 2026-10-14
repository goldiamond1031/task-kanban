<script setup>
import { ref, computed } from 'vue'
import TaskCard from './TaskCard.vue'
import EmptyState from './EmptyState.vue'

const props = defineProps({
  column: { type: Object, required: true },
  taskList: { type: Array, default: () => [] }
})

const emit = defineEmits(['move', 'toggle', 'remove', 'add'])

const isDragOver = ref(false)

const NEXT_COLUMN = { todo: 'doing', doing: 'done', done: '' }
const COLUMN_TITLE = { todo: '待办', doing: '进行中', done: '已完成' }

const nextColumnId = computed(() => NEXT_COLUMN[props.column.id] || '')
const nextColumnTitle = computed(() => COLUMN_TITLE[nextColumnId.value] || '')

function onDragOver(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(event) {
  event.preventDefault()
  isDragOver.value = false
  const taskId = event.dataTransfer.getData('text/plain')
  if (taskId) emit('move', taskId, props.column.id)
}

function onToggle(taskId, field) {
  emit('toggle', taskId, field)
}

function onRemove(taskId) {
  emit('remove', taskId)
}

function onMove(taskId, columnId) {
  emit('move', taskId, columnId)
}
</script>

<template>
  <section
    class="kanban-column"
    :class="{ 'kanban-column--over': isDragOver }"
    :data-column="column.id"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <header class="kanban-column__head">
      <span class="kanban-column__dot" :style="{ background: column.color }"></span>
      <h2 class="kanban-column__title">{{ column.title }}</h2>
      <span class="kanban-column__count">{{ taskList.length }}</span>
    </header>

    <div class="kanban-column__body">
      <TaskCard
        v-for="task in taskList"
        :key="task.id"
        :task="task"
        :next-column-id="nextColumnId"
        :next-column-title="nextColumnTitle"
        @toggle="onToggle"
        @remove="onRemove"
        @move="onMove"
      />
      <EmptyState
        v-if="taskList.length === 0"
        icon="🗂️"
        :title="column.id === 'done' ? '还没有完成的任务' : '这里空空如也'"
        :hint="column.id === 'done' ? '拖拽卡片到这里标记完成' : '拖拽卡片到此处，或新增一个任务'"
        action-text="新增任务"
        action-icon="➕"
        @action="$emit('add')"
      />
    </div>
  </section>
</template>

<style scoped>
.kanban-column {
  display: flex;
  flex-direction: column;
  min-width: 280px;
  flex: 1 1 0;
  background: color-mix(in srgb, var(--color-surface) 70%, transparent);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.kanban-column--over {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface));
}

.kanban-column__head {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding-bottom: var(--space-sm);
  margin-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border);
}

.kanban-column__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.kanban-column__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
}

.kanban-column__count {
  margin-left: auto;
  min-width: 24px;
  padding: 0 var(--space-sm);
  text-align: center;
  font-size: var(--font-size-sm);
  border-radius: var(--radius-full);
  background: var(--color-surface-hover);
  color: var(--color-text-secondary);
}

.kanban-column__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  min-height: 120px;
}

@media (max-width: 860px) {
  .kanban-column {
    min-width: 0;
  }
}
</style>