<script setup>
defineProps({
  icon: { type: String, default: '📭' },
  title: { type: String, default: '暂无内容' },
  hint: { type: String, default: '' },
  actionText: { type: String, default: '' },
  actionIcon: { type: String, default: '' }
})

defineEmits(['action'])
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon" aria-hidden="true">{{ icon }}</div>
    <p class="empty-state__title">{{ title }}</p>
    <p v-if="hint" class="empty-state__hint">{{ hint }}</p>
    <button
      v-if="actionText"
      class="app-button app-button--ghost empty-state__action"
      @click="$emit('action')"
    >
      <span v-if="actionIcon" aria-hidden="true">{{ actionIcon }}</span>
      <span>{{ actionText }}</span>
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-xl) var(--space-md);
  text-align: center;
  color: var(--color-text-secondary);
}

.empty-state__icon {
  font-size: 40px;
  animation: bob 3s ease-in-out infinite;
}

.empty-state__title {
  font-weight: 600;
  color: var(--color-text);
}

.empty-state__hint {
  font-size: var(--font-size-sm);
}

.empty-state__action {
  margin-top: var(--space-sm);
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
</style>