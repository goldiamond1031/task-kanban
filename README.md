# 任务管理看板

一款纯前端的轻量任务管理看板，用 Vue 3 + Vite 构建。所有数据存在浏览器 localStorage 里，不需要后端、不需要数据库，打开浏览器就能用。

## 项目介绍

Vue 3 + Vite 构建的纯前端任务看板，支持拖拽流转、多主题与本地持久化。

## 功能亮点

| 功能 | 说明 |
| --- | --- |
| 三列看板 | 待办 → 进行中 → 已完成，任意两列之间可双向拖拽 |
| 星标标记 | 一键标记重要任务，卡片视觉区分 |
| 紧急标记 | 紧急任务红色边框高亮 |
| 分类管理 | 自定义分类，新增任务时自动补全已有分类 |
| 多主题 | 亮色 / 暗色 / 多彩三套主题，悬停预览、切换带过渡动画 |
| 趣味提示 | 每次操作随机展示一条鼓励性 Toast，悬停暂停、进度条计时 |
| 完成庆祝 | 任务拖入「已完成」列触发 Canvas 粒子动画（彩带 / 星星 / 爱心） |
| 自动保存 | 所有增删改操作即时写入 localStorage，刷新不丢数据 |
| 响应式 | 桌面端三列横排，窄屏自动纵向堆叠 |
| 无障碍 | 遵循 `prefers-reduced-motion`，系统开启减弱动效时降级 |

## 技术栈

| 类别 | 技术 | 版本 |
| --- | --- | --- |
| 框架 | Vue 3（Composition API + `<script setup>`） | ^3.3.0 |
| 构建 | Vite | ^4.5.0 |
| 测试 | Vitest + jsdom + @vue/test-utils | ^0.34.0 / ^21.0.0 / ^2.4.0 |
| 语言 | JavaScript + TypeScript（混合） | — |
| 存储 | 浏览器 localStorage | — |

## 快速开始

```bash
npm install
npm run dev        # 开发服务器，默认 http://localhost:8085
npm run build      # 产出静态文件到 dist/
npm run test       # 跑单元测试
```

Windows 下也可以直接双击 `start-kanban.bat`，脚本会自动切到 UTF-8 编码并拉起 Vite。

## 目录结构

```
task-kanban/
├── index.html                  # HTML 入口
├── vite.config.js              # Vite 配置
├── vitest.config.js            # 测试配置
├── start-kanban.bat            # Windows 一键启动
├── src/
│   ├── main.js                 # 应用入口
│   ├── App.vue                 # 根组件，编排看板与弹窗
│   ├── components/             # 8 个 UI 组件
│   │   ├── NavBar.vue          # 导航栏 + 任务统计
│   │   ├── ThemeSelector.vue   # 主题下拉，支持悬停预览
│   │   ├── KanbanColumn.vue    # 看板列容器，处理拖放
│   │   ├── TaskCard.vue        # 任务卡片
│   │   ├── EmptyState.vue      # 空列插画
│   │   ├── AddTaskModal.vue    # 新增任务弹窗
│   │   ├── FunToast.vue        # 全局趣味提示
│   │   └── Celebration.vue     # Canvas 粒子庆祝动画
│   ├── composables/            # 4 个组合式函数
│   │   ├── useKanban.js        # 核心状态：增删改查、拖拽移动、自动保存
│   │   ├── useToast.ts         # Toast 队列管理
│   │   ├── useTheme.ts         # 主题加载 / 切换 / 预览
│   │   └── useRipple.ts        # 按钮涟漪效果
│   ├── config/
│   │   ├── themes.ts           # 三套主题色板
│   │   └── toastMessages.ts    # 随机提示文案库
│   ├── styles/variables.css    # CSS 自定义属性
│   ├── assets/main.css         # 全局样式与动画关键帧
│   └── utils/
│       ├── storage.js          # localStorage 读写与降级
│       ├── timeFormat.ts       # 相对时间 / 绝对时间格式化
│       └── cssVariables.ts     # CSS 变量动态注入
└── tests/                      # 7 个测试文件
```

## 数据模型

```ts
interface Task {
  id: string
  title: string          // 最长 100 字符
  description?: string
  category?: string
  columnId: 'todo' | 'doing' | 'done'
  starred: boolean
  urgent: boolean
  createdAt: number
}
```

localStorage 里存 `{ tasks: Task[], version: 1 }`，键名 `task-kanban:board`；主题单独存 `task-kanban:theme`。

## 几个设计取舍

**读数据容错，写数据不抛错。** `loadState()` 遇到 JSON 解析失败、字段缺失、`columnId` 非法时，逐条 `normalizeTask()` 清洗，坏数据丢掉而不是整块降级；`saveState()` 整体包在 try/catch 里，localStorage 写满或隐私模式禁用时返回 `false` 而不是让界面崩掉。

**主题靠 CSS 变量，不靠重载样式表。** 三套主题的色值定义在 `src/config/themes.ts`，切换时通过 `applyTheme()` 把变量写到 `:root` 上，所有组件的 `<style scoped>` 只引用 `var(--color-*)`，切换过程没有样式表重解析，也天然支持悬停预览。

**状态用模块级单例。** `useKanban` 的 `tasks` 是模块作用域的 `ref`，多个组件拿到的是同一份数据，不需要额外引入 Pinia 之类的状态库；`tasksByColumn()` 返回预先建好的 `computed`，避免在渲染函数里反复创建。

**拖拽用原生 HTML5 DnD。** 不引第三方拖拽库，代价是不支持列内排序，好处是零依赖、体积小。

## 测试

共 7 个测试文件，覆盖状态管理、存储容错、组件渲染与交互：

| 测试文件 | 覆盖范围 |
| --- | --- |
| `tests/storage.test.js` | localStorage 读写、JSON 格式错误降级、ID 唯一性 |
| `tests/useKanban.test.js` | 增删改、拖拽移动、星标 / 紧急切换、重置 |
| `tests/TaskCard.test.js` | 渲染、标记切换、删除事件、拖拽属性 |
| `tests/KanbanColumn.test.js` | 列渲染、任务计数、拖放事件参数 |
| `tests/AddTaskModal.test.js` | 表单校验、提交数据完整性、分类自动补全 |
| `tests/Celebration.test.js` | 庆祝动画显隐与完成回调 |
| `tests/useToast.test.js` | Toast 入队、出队与自动移除 |

```bash
npm run test
```
