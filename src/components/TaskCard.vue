<script setup>
import { computed } from 'vue'
import { useRipple } from '../composables/useRipple'
import { formatRelativeTime } from '../utils/timeFormat'

const props = defineProps({
  task: { type: Object, required: true },
  nextColumnId: { type: String, default: '' },
  nextColumnTitle: { type: String, default: '' }
})

const emit = defineEmits(['toggle', 'remove', 'move'])

const { createRipple } = useRipple()

const createdText = computed(() => formatRelativeTime(props.task.createdAt))

function onToggle(event, field) {
  createRipple(event)
  emit('toggle', props.task.id, field)
}

function onRemove(event) {
  createRipple(event)
  emit('remove', props.task.id)
}

function onMoveNext(event) {
  createRipple(event)
  if (props.nextColumnId) emit('move', props.task.id, props.nextColumnId)
}

function onDragStart(event) {
  event.dataTransfer.setData('text/plain', props.task.id)
  event.dataTransfer.effectAllowed = 'move'
}
</script>

<template>
  <article
    class="task-card"
    :class="{ 'task-card--starred': task.starred, 'task-card--urgent': task.urgent }"
    draggable="true"
    @dragstart="onDragStart"
  >
    <header class="task-card__head">
      <h3 class="task-card__title">{{ task.title }}</h3>
      <button
        class="task-card__icon task-card__star"
        :class="{ 'is-active': task.starred }"
        :aria-label="task.starred ? '取消星标' : '标记星标'"
        :title="task.starred ? '取消星标' : '标记星标'"
        @click="onToggle($event, 'starred')"
      >
        {{ task.starred ? '★' : '☆' }}
      </button>
    </header>

    <p v-if="task.description" class="task-card__desc">{{ task.description }}</p>

    <footer class="task-card__foot">
      <span v-if="task.category" class="task-card__category">{{ task.category }}</span>
      <span class="task-card__time">{{ createdText }}</span>
    </footer>

    <div class="task-card__actions">
      <button
        class="task-card__icon task-card__urgent"
        :class="{ 'is-active': task.urgent }"
        :aria-label="task.urgent ? '取消紧急' : '标记紧急'"
        :title="task.urgent ? '取消紧急' : '标记紧急'"
        @click="onToggle($event, 'urgent')"
      >
        {{ task.urgent ? '🔥' : '⚡' }}
      </button>
      <button
        v-if="nextColumnId"
        class="task-card__move"
        :title="'移至' + nextColumnTitle"
        @click="onMoveNext"
      >
        移至{{ nextColumnTitle }}
      </button>
      <button class="task-card__icon task-card__remove" aria-label="删除任务" title="删除任务" @click="onRemove">
        🗑
      </button>
    </div>
  </article>
</template>

<style scoped>
.task-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
  cursor: grab;
  transition: box-shadow var(--transition-fast), transform var(--transition-fast),
    border-color var(--transition-fast);
  animation: fade-in-up var(--transition-base) ease-out;
}

.task-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.task-card:active {
  cursor: grabbing;
}

.task-card--starred {
  border-left-color: var(--color-star);
}

.task-card--urgent {
  border-color: var(--color-urgent);
  border-left-color: var(--color-urgent);
  box-shadow: 0 0 0 2px rgba(229, 62, 62, 0.18);
}

.task-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-sm);
}

.task-card__title {
  font-size: var(--font-size-base);
  font-weight: 600;
  word-break: break-word;
}

.task-card__desc {
  margin-top: var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  word-break: break-word;
  white-space: pre-wrap;
}

.task-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

.task-card__category {
  display: inline-block;
  padding: 2px var(--space-sm);
  font-size: 12px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
  color: var(--color-primary);
}

.task-card__time {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-left: auto;
}

.task-card__actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px dashed var(--color-border);
}

.task-card__icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 15px;
  line-height: 1;
  color: var(--color-text-secondary);
  transition: background var(--transition-fast), color var(--transition-fast);
}

.task-card__icon:hover {
  background: var(--color-surface-hover);
}

.task-card__star.is-active {
  color: var(--color-star);
}

.task-card__urgent.is-active {
  color: var(--color-urgent);
}

.task-card__remove:hover {
  color: var(--color-urgent);
}

.task-card__move {
  margin-left: auto;
  padding: 2px var(--space-sm);
  font-size: 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  transition: background var(--transition-fast), color var(--transition-fast);
}

.task-card__move:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}
</style>