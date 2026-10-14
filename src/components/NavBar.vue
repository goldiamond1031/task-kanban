<script setup>
import { computed } from 'vue'
import ThemeSelector from './ThemeSelector.vue'
import { useRipple } from '../composables/useRipple'

const props = defineProps({
  tasks: { type: Array, default: () => [] }
})

const emit = defineEmits(['add-task', 'reset'])

const { createRipple } = useRipple()

const total = computed(() => props.tasks.length)
const doneCount = computed(() => props.tasks.filter((t) => t.columnId === 'done').length)
const starredCount = computed(() => props.tasks.filter((t) => t.starred).length)
const progress = computed(() =>
  total.value ? Math.round((doneCount.value / total.value) * 100) : 0
)

function onAdd(event) {
  createRipple(event)
  emit('add-task')
}

function onReset(event) {
  createRipple(event)
  if (window.confirm('确定要清空所有任务吗？此操作不可恢复。')) {
    emit('reset')
  }
}
</script>

<template>
  <header class="navbar">
    <div class="navbar__brand">
      <span class="navbar__logo" aria-hidden="true">📋</span>
      <div class="navbar__titles">
        <h1 class="navbar__title">任务管理看板</h1>
        <p class="navbar__subtitle">拖拽流转 · 多主题 · 本地持久化</p>
      </div>
    </div>

    <div class="navbar__stats">
      <div class="navbar__stat">
        <span class="navbar__stat-value">{{ total }}</span>
        <span class="navbar__stat-label">全部</span>
      </div>
      <div class="navbar__stat">
        <span class="navbar__stat-value">{{ doneCount }}</span>
        <span class="navbar__stat-label">已完成</span>
      </div>
      <div class="navbar__stat">
        <span class="navbar__stat-value">{{ starredCount }}</span>
        <span class="navbar__stat-label">重点</span>
      </div>
      <div class="navbar__progress" :title="'完成率 ' + progress + '%'">
        <span class="navbar__progress-fill" :style="{ width: progress + '%' }"></span>
      </div>
    </div>

    <div class="navbar__actions">
      <button class="app-button" @click="onAdd">
        <span aria-hidden="true">➕</span>
        <span>新增任务</span>
      </button>
      <button class="app-button app-button--ghost" @click="onReset">
        <span aria-hidden="true">♻️</span>
        <span>重置</span>
      </button>
      <ThemeSelector />
    </div>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: var(--z-nav);
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.navbar__logo {
  font-size: 28px;
}

.navbar__title {
  font-size: var(--font-size-xl);
  font-weight: 800;
  letter-spacing: 0.5px;
}

.navbar__subtitle {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.navbar__stats {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-left: auto;
}

.navbar__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 44px;
}

.navbar__stat-value {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
}

.navbar__stat-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.navbar__progress {
  width: 120px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-surface-hover);
  overflow: hidden;
}

.navbar__progress-fill {
  display: block;
  height: 100%;
  background: var(--color-primary);
  transition: width var(--transition-base);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

@media (max-width: 860px) {
  .navbar {
    padding: var(--space-sm) var(--space-md);
  }

  .navbar__stats {
    order: 3;
    width: 100%;
    margin-left: 0;
    justify-content: space-between;
  }

  .navbar__progress {
    width: 80px;
  }
}
</style>