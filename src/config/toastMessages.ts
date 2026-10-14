export type ToastType =
  | 'add'
  | 'move'
  | 'star'
  | 'urgent'
  | 'delete'
  | 'reset'
  | 'theme'
  | 'done'

export const TOAST_MESSAGES: Record<ToastType, string[]> = {
  add: [
    '新任务已加入待办清单 ✨',
    '记下啦！好记性不如烂笔头 📝',
    '任务已创建，掌控感 +1 💪',
    '又清空了一个脑内待办 🧠',
    '收到！这就安排上 🚀'
  ],
  move: [
    '任务已流转，继续加油 ⏩',
    '状态更新成功，节奏很稳 🎯',
    '一步一步来，进展看得见 🌱',
    '卡片挪走啦，井井有条 📋'
  ],
  star: [
    '已标记为重点，优先关注 ⭐',
    '星标成功，重要的事情说三遍 🌟',
    '重点任务已置顶你的心 ✨'
  ],
  urgent: [
    '标记为紧急，全力冲刺 🔥',
    '紧急任务已高亮，别忘啦 ⏰',
    '红色警报，优先级拉满 🚨'
  ],
  delete: [
    '任务已移除，轻装上阵 🍃',
    '删除成功，断舍离也是一种进步 🗑️',
    '已清理，空间更清爽了 ✨'
  ],
  reset: [
    '看板已重置，全新的开始 🌈',
    '一切归零，重新出发 🚀',
    '清空完成，又是一块干净的画布 🎨'
  ],
  theme: [
    '主题切换成功，换个心情 🎨',
    '新皮肤已就位，好看吗 👀',
    '视觉焕新完成 ✨'
  ],
  done: [
    '🎉 任务完成，为你鼓掌！',
    '太棒了！又搞定一件 ✅',
    '完成 +1，成就感拉满 🏆',
    '漂亮！这一步稳稳拿下 💯'
  ]
}

export function pickMessage(type: ToastType): string {
  const list = TOAST_MESSAGES[type] || TOAST_MESSAGES.add
  return list[Math.floor(Math.random() * list.length)]
}