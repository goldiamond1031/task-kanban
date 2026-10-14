<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from '../composables/useTheme'
import { THEMES, THEME_ORDER } from '../config/themes'

const { currentTheme, setTheme, previewTheme, cancelPreview } = useTheme()

const open = ref(false)
const rootEl = ref(null)

const THEME_SWATCH = {
  light: 'linear-gradient(135deg, #ffffff 50%, #4f46e5 50%)',
  dark: 'linear-gradient(135deg, #1e293b 50%, #6366f1 50%)',
  colorful: 'linear-gradient(135deg, #d946ef 50%, #10b981 50%)'
}

function toggle() {
  open.value = !open.value
}

function choose(id) {
  setTheme(id)
  open.value = false
}

function onEnter(id) {
  if (id !== currentTheme.value) previewTheme(id)
}

function onLeave() {
  cancelPreview()
}

function onDocumentClick(event) {
  if (rootEl.value && !rootEl.value.contains(event.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div ref="rootEl" class="theme-selector">
    <button class="app-button app-button--ghost theme-selector__trigger" @click="toggle">
      <span aria-hidden="true">🎨</span>
      <span>{{ THEMES[currentTheme].name }}</span>
      <span class="theme-selector__caret" :class="{ 'is-open': open }" aria-hidden="true">▾</span>
    </button>

    <transition name="fade">
      <ul v-if="open" class="theme-selector__menu">
        <li v-for="id in THEME_ORDER" :key="id">
          <button
            class="theme-selector__option"
            :class="{ 'is-active': id === currentTheme }"
            @mouseenter="onEnter(id)"
            @mouseleave="onLeave"
            @click="choose(id)"
          >
            <span class="theme-selector__swatch" :style="{ background: THEME_SWATCH[id] }"></span>
            <span>{{ THEMES[id].name }}</span>
            <span v-if="id === currentTheme" class="theme-selector__check" aria-hidden="true">✓</span>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.theme-selector {
  position: relative;
}

.theme-selector__caret {
  transition: transform var(--transition-fast);
}

.theme-selector__caret.is-open {
  transform: rotate(180deg);
}

.theme-selector__menu {
  position: absolute;
  right: 0;
  top: calc(100% + var(--space-sm));
  min-width: 160px;
  padding: var(--space-xs);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-modal);
}

.theme-selector__option {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  text-align: left;
  transition: background var(--transition-fast);
}

.theme-selector__option:hover {
  background: var(--color-surface-hover);
}

.theme-selector__swatch {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
}

.theme-selector__check {
  margin-left: auto;
  color: var(--color-primary);
}
</style>