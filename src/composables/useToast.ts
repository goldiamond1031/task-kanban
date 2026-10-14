import { ref } from 'vue'
import { pickMessage, type ToastType } from '../config/toastMessages'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  duration: number
}

interface TimerEntry {
  timer: number
  start: number
  remaining: number
}

export const TOAST_DURATION = 2600

const toasts = ref<ToastItem[]>([])
const timers = new Map<string, TimerEntry>()
let seq = 0

function genId(): string {
  seq += 1
  return 'toast_' + seq + '_' + Date.now()
}

function startTimer(item: ToastItem, duration: number): void {
  const start = Date.now()
  const timer = window.setTimeout(() => {
    removeToast(item.id)
  }, duration)
  timers.set(item.id, { timer, start, remaining: duration })
}

export function showToast(type: ToastType, duration: number = TOAST_DURATION): void {
  const item: ToastItem = {
    id: genId(),
    type,
    message: pickMessage(type),
    duration
  }
  toasts.value.push(item)
  startTimer(item, duration)
}

export function removeToast(id: string): void {
  const entry = timers.get(id)
  if (entry) {
    clearTimeout(entry.timer)
    timers.delete(id)
  }
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

export function clearToasts(): void {
  timers.forEach((entry) => clearTimeout(entry.timer))
  timers.clear()
  toasts.value = []
}

export function pauseToast(id: string): void {
  const entry = timers.get(id)
  if (!entry) return
  clearTimeout(entry.timer)
  entry.remaining = Math.max(0, entry.remaining - (Date.now() - entry.start))
  timers.set(id, entry)
}

export function resumeToast(id: string): void {
  const item = toasts.value.find((t) => t.id === id)
  const entry = timers.get(id)
  if (!item) return
  if (!entry) {
    startTimer(item, item.duration)
    return
  }
  startTimer(item, entry.remaining > 0 ? entry.remaining : item.duration)
}

export function useToast() {
  return {
    toasts,
    show: showToast,
    remove: removeToast,
    clear: clearToasts,
    pause: pauseToast,
    resume: resumeToast
  }
}