<script setup>
import { ref } from 'vue'
import { useToast } from '../composables/useToast'

const { toasts, remove, pause, resume } = useToast()

const hoveredId = ref('')

function onEnter(id) {
  hoveredId.value = id
  pause(id)
}

function onLeave(id) {
  hoveredId.value = ''
  resume(id)
}
</script>

<template>
  <div class="fun-toast" aria-live="polite">
    <transition-group name="toast">
      <div
        v-for="item in toasts"
        :key="item.id"
        class="fun-toast__item"
        @mouseenter="onEnter(item.id)"
        @mouseleave="onLeave(item.id)"
        @click="remove(item.id)"
      >
        <span class="fun-toast__message">{{ item.message }}</span>
        <span
          class="fun-toast__bar"
          :style="{ animationDuration: item.duration + 'ms', animationPlayState: hoveredId === item.id ? 'paused' : 'running' }"
        ></span>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.fun-toast {
  position: fixed;
  right: var(--space-lg);
  bottom: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  z-index: var(--z-toast);
  pointer-events: none;
}

.fun-toast__item {
  position: relative;
  min-width: 200px;
  max-width: 320px;
  padding: var(--space-sm) var(--space-md);
  padding-bottom: calc(var(--space-sm) + 4px);
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  cursor: pointer;
  pointer-events: auto;
}

.fun-toast__message {
  font-size: var(--font-size-sm);
}

.fun-toast__bar {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  background: var(--color-primary);
  transform-origin: left center;
  animation-name: toast-countdown;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes toast-countdown {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

@media (max-width: 860px) {
  .fun-toast {
    right: var(--space-md);
    left: var(--space-md);
    bottom: var(--space-md);
  }
}
</style>