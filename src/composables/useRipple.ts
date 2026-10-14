export function createRipple(event: MouseEvent): void {
  const target = event.currentTarget as HTMLElement | null
  if (!target) return
  const rect = target.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const span = document.createElement('span')
  span.className = 'ripple-effect'
  span.style.width = size + 'px'
  span.style.height = size + 'px'
  span.style.left = event.clientX - rect.left - size / 2 + 'px'
  span.style.top = event.clientY - rect.top - size / 2 + 'px'
  if (getComputedStyle(target).position === 'static') {
    target.style.position = 'relative'
  }
  target.appendChild(span)
  window.setTimeout(() => {
    span.remove()
  }, 600)
}

export function useRipple() {
  return { createRipple }
}