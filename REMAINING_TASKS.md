# 📋 剩余开发任务清单

> **目标**: 将现有的Web论文阅读器升级为功能完整的Windows桌面应用
> **已完成**: Electron框架、数据层、IPC通信
> **待完成**: 所有UI组件和配置文件

---

## ✅ 已完成的基础设施

### 1. Electron后端 (100% 完成)
- ✅ `electron/main.ts` - 主进程（窗口管理、文件操作）
- ✅ `electron/preload.ts` - 安全API暴露
- ✅ IPC通信API完整实现

### 2. 数据层 (100% 完成)
- ✅ `src/types/library.ts` - 所有类型定义
- ✅ `src/store/libraryStore.ts` - 状态管理（Zustand）
- ✅ 数据持久化逻辑

### 3. 现有组件 (可复用)
- ✅ `src/components/PaperViewer.tsx` - PDF/文本查看器
- ✅ `src/components/PDFViewer.tsx` - PDF渲染器
- ✅ `src/components/MarkdownEditor.tsx` - Markdown编辑器
- ✅ `src/components/DictionaryPopup.tsx` - 词典弹窗

---

## 🔨 需要创建的组件和文件

### 第一优先级：核心UI组件

#### 1. 📚 论文库视图组件
**文件**: `src/components/LibraryView.tsx` 和 `src/components/LibraryView.css`

**功能需求**:
- 显示所有已导入的论文（网格或列表视图）
- 每篇论文显示：标题、摘要预览、标签、添加日期
- 顶部工具栏：
  - "添加论文"按钮（调用 `window.electronAPI.selectPdfFile()`）
  - "选择文件夹"按钮（调用 `window.electronAPI.selectDirectory()`）
  - 搜索框（过滤论文）
  - 视图切换（网格/列表）
- 点击论文卡片：切换到阅读视图并加载该论文
- 右键菜单：编辑、删除、查看笔记

**需要使用的API**:
```typescript
// 从 libraryStore 获取数据
import { useLibraryStore } from '../store/libraryStore'
const { papers, addPaper, deletePaper, setSelectedPaper, setCurrentView } = useLibraryStore()

// 添加论文示例
const handleAddPaper = async () => {
  const filePath = await window.electronAPI.selectPdfFile()
  if (filePath) {
    const paper: PaperEntry = {
      id: crypto.randomUUID(),
      title: extractTitleFromPath(filePath), // 从文件名提取标题
      filePath,
      fileType: filePath.endsWith('.pdf') ? 'pdf' : 'text',
      summary: '',
      notesPath: filePath.replace(/\.(pdf|txt)$/, '_notes.md'),
      tags: [],
      addedDate: new Date(),
      lastModified: new Date(),
    }
    addPaper(paper)
  }
}
```

**UI设计建议**:
- 使用卡片布局，现代化设计
- 每个卡片显示缩略图（PDF第一页或文件图标）
- 悬停效果和过渡动画
- 空状态提示（没有论文时显示引导）

---

#### 2. 📝 论文卡片组件
**文件**: `src/components/PaperCard.tsx` 和 `src/components/PaperCard.css`

**功能需求**:
- 显示单篇论文的信息卡片
- 包含：
  - 文件图标（PDF/TXT）
  - 标题
  - Summary摘要（最多3行，超出显示"..."）
  - 标签（Tag chips）
  - 日期信息
- 交互：
  - 点击：打开论文阅读器
  - 右键：显示上下文菜单
  - 悬停：高亮并显示完整summary

**Props接口**:
```typescript
interface PaperCardProps {
  paper: PaperEntry
  onClick: () => void
  onDelete: () => void
  onEdit: () => void
}
```

---

#### 3. ✏️ Summary编辑器组件
**文件**: `src/components/SummaryEditor.tsx` 和 `src/components/SummaryEditor.css`

**功能需求**:
- 用于编辑论文的Summary摘要
- 支持Markdown语法
- 实时预览（可选）
- 自动保存功能（防抖500ms）
- 字数统计显示
- 工具栏：粗体、斜体、列表等快捷按钮

**需要使用的API**:
```typescript
const { updatePaper, getPaper } = useLibraryStore()

const handleSave = (paperId: string, summary: string) => {
  updatePaper(paperId, { summary })
  // 自动保存到文件系统
  saveLibrary()
}
```

---

#### 4. 🗺️ 思维导图视图组件
**文件**: `src/components/MindMapView.tsx` 和 `src/components/MindMapView.css`

**功能需求**:
- 使用 React Flow 渲染思维导图
- 节点类型：
  - **主题节点** (紫色圆角矩形) - 研究主题
  - **论文节点** (蓝色卡片) - 显示论文标题和简短summary
  - **笔记节点** (黄色便签) - 自由文本
- 工具栏：
  - 添加主题节点
  - 添加论文节点（从论文库拖拽或选择）
  - 添加笔记节点
  - 连接线工具
  - 保存思维导图
- 交互：
  - 拖拽移动节点
  - 双击论文节点：打开该论文阅读器
  - 双击笔记节点：编辑内容
  - 右键：删除节点/编辑/改变颜色

**React Flow集成示例**:
```typescript
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

const MindMapView = () => {
  const { getMindMap, updateMindMap } = useLibraryStore()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  )
}
```

**自定义节点组件**:
```typescript
// src/components/PaperNode.tsx
const PaperNode = ({ data }) => (
  <div className="paper-node">
    <div className="node-header">
      <span>📕</span>
      <h4>{data.title}</h4>
    </div>
    <p className="node-summary">{data.summary?.slice(0, 100)}...</p>
    <div className="node-footer">
      <span>双击打开</span>
    </div>
  </div>
)
```

---

#### 5. 🖥️ 桌面应用主布局
**文件**: `src/components/DesktopApp.tsx` 和 `src/components/DesktopApp.css`

**功能需求**:
- 整合所有视图的主容器
- 顶部导航栏：
  - Logo和标题
  - 视图切换按钮：[📚 论文库] [🗺️ 思维导图] [📖 阅读] [📝 笔记]
  - 设置按钮
- 主内容区（根据currentView显示不同组件）：
  - `library` - 显示 LibraryView
  - `mindmap` - 显示 MindMapView
  - `reading` - 显示 PaperViewer + MarkdownEditor（双栏）
  - `notes-only` - 仅显示 MarkdownEditor

**布局结构**:
```typescript
const DesktopApp = () => {
  const { currentView, selectedPaperId } = useLibraryStore()

  return (
    <div className="desktop-app">
      <Navbar />
      <main className="app-content">
        {currentView === 'library' && <LibraryView />}
        {currentView === 'mindmap' && <MindMapView />}
        {currentView === 'reading' && (
          <div className="reading-layout">
            <PaperViewer />
            <MarkdownEditor />
          </div>
        )}
        {currentView === 'notes-only' && <MarkdownEditor />}
      </main>
    </div>
  )
}
```

---

### 第二优先级：配置文件

#### 6. ⚙️ Vite配置更新
**文件**: `vite.config.ts`

**需要修改**:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.ELECTRON_RENDERER_URL ? './' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
})
```

---

#### 7. 📦 Electron-Vite配置
**文件**: `electron-vite.config.ts`

**创建新文件**:
```typescript
import { defineConfig } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main.ts'),
        },
      },
    },
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload.ts'),
        },
      },
    },
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
        },
      },
    },
  },
})
```

---

#### 8. 🔧 TypeScript配置更新
**文件**: `tsconfig.json`

**添加Electron类型**:
```json
{
  "compilerOptions": {
    "types": ["node", "vite/client"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "electron"]
}
```

---

### 第三优先级：增强功能

#### 9. 🎨 导航栏组件
**文件**: `src/components/Navbar.tsx`

**功能需求**:
- 应用标题和图标
- 视图切换按钮（带图标和标签）
- 活动状态指示
- 设置按钮（打开设置面板）

---

#### 10. ⚙️ 设置面板组件
**文件**: `src/components/SettingsPanel.tsx`

**功能需求**:
- 监控目录管理（添加/删除）
- 主题切换（明亮/暗黑）
- 字体大小设置
- 数据导出/导入
- 关于信息

---

#### 11. 🔍 搜索组件
**文件**: `src/components/SearchBar.tsx`

**功能需求**:
- 全局搜索论文标题、内容、标签
- 搜索建议下拉列表
- 快捷键支持（Ctrl+F）

---

#### 12. 🏷️ 标签管理组件
**文件**: `src/components/TagManager.tsx`

**功能需求**:
- 添加/删除标签
- 标签颜色自定义
- 按标签过滤论文

---

### 第四优先级：工具函数

#### 13. 📁 文件处理工具
**文件**: `src/utils/fileHelpers.ts`

**需要的函数**:
```typescript
// 从文件路径提取标题
export const extractTitleFromPath = (filePath: string): string => {
  const fileName = filePath.split(/[\\/]/).pop() || ''
  return fileName.replace(/\.(pdf|txt)$/, '')
}

// 生成唯一ID
export const generateId = (): string => {
  return crypto.randomUUID()
}

// 格式化日期
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN').format(new Date(date))
}

// 读取PDF第一页作为缩略图
export const generateThumbnail = async (pdfPath: string): Promise<string> => {
  // 实现PDF缩略图生成逻辑
}
```

---

#### 14. 🎨 主题和样式
**文件**: `src/styles/theme.css`

**创建全局主题变量**:
```css
:root {
  /* 主色调 */
  --primary-color: #667eea;
  --secondary-color: #764ba2;

  /* 背景色 */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #e0e0e0;

  /* 文字颜色 */
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;

  /* 边框和阴影 */
  --border-color: #e0e0e0;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);

  /* 间距 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}

/* 暗色主题 */
[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
}
```

---

## 🎯 主App更新

#### 15. 更新主应用入口
**文件**: `src/App.tsx`

**需要修改**:
```typescript
import { useEffect } from 'react'
import { useLibraryStore } from './store/libraryStore'
import DesktopApp from './components/DesktopApp'
import DictionaryPopup from './components/DictionaryPopup'
import { useAppStore } from './store/appStore'

function App() {
  const { loadLibrary } = useLibraryStore()
  const { selectedWord, wordPosition } = useAppStore()

  useEffect(() => {
    // 检测是否在Electron环境
    if (window.electronAPI) {
      loadLibrary()
    }
  }, [loadLibrary])

  // 如果在Electron环境，使用桌面版布局
  if (window.electronAPI) {
    return (
      <>
        <DesktopApp />
        {selectedWord && wordPosition && <DictionaryPopup />}
      </>
    )
  }

  // 否则使用原有的Web版布局
  return (
    <div className="app">
      {/* 原有的Web版代码 */}
    </div>
  )
}

export default App
```

---

## 📊 开发优先级总结

### 🔴 P0 - 核心功能（必须完成）
1. ✅ LibraryView - 论文库视图
2. ✅ PaperCard - 论文卡片
3. ✅ DesktopApp - 主布局
4. ✅ SummaryEditor - 摘要编辑器
5. ✅ 更新App.tsx - 双模式支持

### 🟡 P1 - 重要功能（强烈建议）
6. ✅ MindMapView - 思维导图
7. ✅ Navbar - 导航栏
8. ✅ vite.config.ts - Vite配置
9. ✅ electron-vite.config.ts - Electron配置

### 🟢 P2 - 增强功能（可选）
10. ⭕ SearchBar - 搜索功能
11. ⭕ SettingsPanel - 设置面板
12. ⭕ TagManager - 标签管理
13. ⭕ 主题系统 - 暗色模式

---

## 🛠️ 给Gemini的开发指引

### API使用说明

**Electron文件操作API** (已实现，可直接使用):
```typescript
// 所有API通过 window.electronAPI 访问

// 选择目录
const dirPath = await window.electronAPI.selectDirectory()

// 选择PDF文件
const filePath = await window.electronAPI.selectPdfFile()

// 读取文件（返回base64）
const result = await window.electronAPI.readFile(filePath)

// 读取文本文件
const result = await window.electronAPI.readTextFile(filePath)

// 写入文件
await window.electronAPI.writeFile(filePath, content)

// 扫描目录
const result = await window.electronAPI.scanDirectory(dirPath)

// 保存库数据
await window.electronAPI.saveLibraryData(JSON.stringify(data))

// 加载库数据
const result = await window.electronAPI.loadLibraryData()
```

**状态管理API** (Zustand store):
```typescript
import { useLibraryStore } from '../store/libraryStore'

// 在组件中使用
const {
  papers,          // 论文列表
  mindMaps,        // 思维导图列表
  currentView,     // 当前视图
  selectedPaperId, // 选中的论文ID

  // 方法
  addPaper,
  updatePaper,
  deletePaper,
  getPaper,
  setCurrentView,
  setSelectedPaper,
  addMindMap,
  updateMindMap,
  saveLibrary,     // 保存到本地
  loadLibrary,     // 从本地加载
} = useLibraryStore()
```

### UI/UX设计要求

1. **现代化设计**:
   - 使用卡片式布局
   - 圆角和阴影效果
   - 流畅的过渡动画
   - 渐变色按钮

2. **响应式**:
   - 适配不同窗口大小
   - 可调节的分栏布局
   - 最小宽度限制

3. **用户友好**:
   - 清晰的视觉层次
   - 明显的交互反馈
   - 加载状态提示
   - 空状态引导

4. **配色建议**:
   - 主色：紫色渐变 (#667eea → #764ba2)
   - 强调色：蓝色 (#4A90E2)
   - 成功：绿色 (#27AE60)
   - 警告：橙色 (#F39C12)
   - 危险：红色 (#E74C3C)

### 测试要点

1. **功能测试**:
   - [ ] 添加论文成功
   - [ ] PDF可以正常打开
   - [ ] 笔记可以编辑和保存
   - [ ] 思维导图节点可拖拽
   - [ ] Summary自动保存

2. **性能测试**:
   - [ ] 大量论文（100+）加载速度
   - [ ] PDF渲染流畅度
   - [ ] 思维导图操作流畅度

3. **边界测试**:
   - [ ] 空状态显示
   - [ ] 错误处理（文件不存在）
   - [ ] 数据恢复（崩溃后）

---

## 📦 构建和运行

### 开发模式
```bash
# 安装依赖
npm install

# Web模式开发（现有功能）
npm run dev

# Electron模式开发（新功能）
npm run dev:electron
```

### 生产构建
```bash
# 构建Windows安装包
npm run build

# 仅构建不打包
npm run build:dir
```

### 输出位置
```
release/0.3.0/Journal Reader Setup 0.3.0.exe
```

---

## 🎨 UI设计参考

建议参考以下现代应用的设计风格：
- Notion（卡片式布局）
- Obsidian（笔记管理）
- Zotero（论文管理）
- MindMeister（思维导图）

---

## ✅ 验收标准

完成后应该实现：
1. ✅ 可以选择文件夹导入论文
2. ✅ 论文库以卡片方式展示
3. ✅ 每篇论文可以编辑Summary
4. ✅ 可以创建思维导图
5. ✅ 思维导图中可以添加论文节点
6. ✅ 双击论文节点打开阅读器
7. ✅ 阅读时自动关联笔记文件
8. ✅ 可以在不打开PDF的情况下查看笔记
9. ✅ 数据持久化（关闭重开不丢失）
10. ✅ 打包成Windows安装包

---

**祝开发顺利！有问题随时询问。** 🚀
