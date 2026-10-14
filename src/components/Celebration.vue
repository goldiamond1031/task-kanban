<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  effect: { type: String, default: 'confetti' },
  duration: { type: Number, default: 2200 }
})

const emit = defineEmits(['complete'])

const canvasRef = ref(null)

const COLORS = ['#4f46e5', '#d946ef', '#f6ad55', '#38a169', '#e53e3e', '#fbbf24', '#0ea5e9']
const SHAPES = ['confetti', 'star', 'heart']

let particles = []
let rafId = 0
let startTime = 0
let running = false

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function createParticles(width, height) {
  const list = []
  const count = props.effect === 'confetti' ? 140 : 90
  const shapes = props.effect === 'confetti' ? ['confetti'] : [props.effect]
  for (let i = 0; i < count; i += 1) {
    list.push({
      x: randomBetween(0, width),
      y: randomBetween(-height * 0.4, 0),
      vx: randomBetween(-1.6, 1.6),
      vy: randomBetween(2, 5),
      gravity: randomBetween(0.04, 0.1),
      size: randomBetween(5, 11),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: randomBetween(0, Math.PI * 2),
      vr: randomBetween(-0.15, 0.15),
      life: Math.floor(randomBetween(90, 160)),
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    })
  }
  return list
}

function drawStar(ctx, size) {
  ctx.beginPath()
  for (let i = 0; i < 5; i += 1) {
    const outerAngle = (Math.PI / 2) * 3 + (i * 2 * Math.PI) / 5
    const innerAngle = outerAngle + Math.PI / 5
    ctx.lineTo(Math.cos(outerAngle) * size, Math.sin(outerAngle) * size)
    ctx.lineTo(Math.cos(innerAngle) * size * 0.45, Math.sin(innerAngle) * size * 0.45)
  }
  ctx.closePath()
  ctx.fill()
}

function drawHeart(ctx, size) {
  ctx.beginPath()
  ctx.moveTo(0, size * 0.3)
  ctx.bezierCurveTo(size, -size * 0.5, size * 0.5, -size, 0, -size * 0.4)
  ctx.bezierCurveTo(-size * 0.5, -size, -size, -size * 0.5, 0, size * 0.3)
  ctx.closePath()
  ctx.fill()
}

function drawParticle(ctx, p) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.fillStyle = p.color
  ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 40))
  if (p.shape === 'star') {
    drawStar(ctx, p.size)
  } else if (p.shape === 'heart') {
    drawHeart(ctx, p.size)
  } else {
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
  }
  ctx.restore()
}

function frame(now) {
  if (!running) return
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const elapsed = now - startTime

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach((p) => {
    p.vy += p.gravity
    p.x += p.vx
    p.y += p.vy
    p.rotation += p.vr
    p.life -= 1
    drawParticle(ctx, p)
  })

  particles = particles.filter((p) => p.life > 0 && p.y < canvas.height + 60)

  if (elapsed < props.duration && particles.length) {
    rafId = requestAnimationFrame(frame)
  } else {
    finish(ctx, canvas)
  }
}

function finish(ctx, canvas) {
  running = false
  rafId = 0
  particles = []
  if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height)
  emit('complete')
}

function stop() {
  running = false
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
  particles = []
  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

function start() {
  stop()
  if (prefersReducedMotion()) {
    emit('complete')
    return
  }
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  canvas.style.width = window.innerWidth + 'px'
  canvas.style.height = window.innerHeight + 'px'
  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  particles = createParticles(window.innerWidth, window.innerHeight)
  startTime = performance.now()
  running = true
  rafId = requestAnimationFrame(frame)
}

watch(
  () => props.visible,
  (value) => {
    if (value) start()
    else stop()
  }
)

onBeforeUnmount(stop)
</script>

<template>
  <canvas ref="canvasRef" class="celebration" :class="{ 'is-active': visible }" aria-hidden="true"></canvas>
</template>

<style scoped>
.celebration {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: var(--z-celebration);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.celebration.is-active {
  opacity: 1;
}
</style>