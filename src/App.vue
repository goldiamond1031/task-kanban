<script setup>
import { ref, computed, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import KanbanColumn from './components/KanbanColumn.vue'
import AddTaskModal from './components/AddTaskModal.vue'
import FunToast from './components/FunToast.vue'
import Celebration from './components/Celebration.vue'
import { useKanban } from './composables/useKanban'
import { useToast } from './composables/useToast'

const {
  tasks,
  columns,
  initKanban,
  addTask,
  removeTask,
  moveTask,
  toggleStarred,
  toggleUrgent,
  resetBoard,
  tasksByColumn,
  existingCategories
} = useKanban()

const { show } = useToast()

const modalVisible = ref(false)
const celebrationVisible = ref(false)
const celebrationEffect = ref('confetti')

const EFFECTS = ['confetti', 'star', 'heart']

const boardColumns = computed(() =>
  columns.value.map((col) => ({ column: col, list: tasksByColumn(col.id).value }))
)

onMounted(() => {
  initKanban()
})

function openModal() {
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function handleAddTask(input) {
  const result = addTask(input)
  if (!result || !result.ok) return
  show('add')
  modalVisible.value = false
}

function handleToggle(taskId, field) {
  if (field === 'starred') {
    toggleStarred(taskId)
    show('star')
  } else if (field === 'urgent') {
    toggleUrgent(taskId)
    show('urgent')
  }
}

function handleRemove(taskId) {
  removeTask(taskId)
  show('delete')
}

function handleMove(taskId, columnId) {
  const result = moveTask(taskId, columnId)
  if (!result.moved) return
  if (result.enteredDone) {
    celebrationEffect.value = EFFECTS[Math.floor(Math.random() * EFFECTS.length)]
    celebrationVisible.value = true
    show('done')
  } else {
    show('move')
  }
}

function handleReset() {
  resetBoard()
  show('reset')
}

function handleCelebrationComplete() {
  celebrationVisible.value = false
}
</script>

<template>
  <div class="app">
    <NavBar :tasks="tasks" @add-task="openModal" @reset="handleReset" />

    <main class="board">
      <KanbanColumn
        v-for="item in boardColumns"
        :key="item.column.id"
        :column="item.column"
        :task-list="item.list"
        @add="openModal"
        @move="handleMove"
        @toggle="handleToggle"
        @remove="handleRemove"
      />
    </main>

    <AddTaskModal
      v-if="modalVisible"
      :columns="columns"
      :existing-categories="existingCategories"
      @submit="handleAddTask"
      @close="closeModal"
    />

    <FunToast />
    <Celebration
      :visible="celebrationVisible"
      :effect="celebrationEffect"
      :duration="2200"
      @complete="handleCelebrationComplete"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.board {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-lg);
  align-items: flex-start;
  flex: 1;
}

@media (max-width: 860px) {
  .board {
    flex-direction: column;
    padding: var(--space-md);
  }
}
</style>