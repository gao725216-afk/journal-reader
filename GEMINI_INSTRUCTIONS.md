# 🤖 Gemini AI开发指令

## 项目概述
将现有Web应用（双语论文阅读器）升级为Electron桌面应用，添加论文管理和思维导图功能。

**技术栈**: React 18 + TypeScript + Electron + React Flow + Zustand

---

## ✅ 已完成（无需处理）
- Electron主进程和IPC通信
- 数据类型定义和状态管理
- PDF阅读器、Markdown编辑器、词典弹窗
- 所有后端API

---

## 🎯 你的任务：创建以下15个文件

### 1️⃣ LibraryView.tsx (论文库主视图)
**路径**: `src/components/LibraryView.tsx`

**要求**:
- 网格布局展示论文卡片
- 顶部工具栏：添加论文按钮、搜索框
- 点击卡片切换到阅读视图
- 空状态友好提示

**代码框架**:
```typescript
import { useLibraryStore } from '../store/libraryStore'
import PaperCard from './PaperCard'
import './LibraryView.css'

const LibraryView = () => {
  const { papers, addPaper, setSelectedPaper, setCurrentView } = useLibraryStore()

  const handleAddPaper = async () => {
    const filePath = await window.electronAPI.selectPdfFile()
    if (filePath) {
      const paper = {
        id: crypto.randomUUID(),
        title: filePath.split(/[\\/]/).pop()?.replace(/\.(pdf|txt)$/, '') || 'Untitled',
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

  const handlePaperClick = (paperId: string) => {
    setSelectedPaper(paperId)
    setCurrentView('reading')
  }

  return (
    <div className="library-view">
      <header className="library-header">
        <h2>📚 我的论文库</h2>
        <div className="toolbar">
          <button onClick={handleAddPaper} className="btn-primary">
            + 添加论文
          </button>
        </div>
      </header>
      <div className="papers-grid">
        {papers.length === 0 ? (
          <div className="empty-state">
            <p>还没有论文，点击上方按钮添加</p>
          </div>
        ) : (
          papers.map(paper => (
            <PaperCard
              key={paper.id}
              paper={paper}
              onClick={() => handlePaperClick(paper.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default LibraryView
```

**CSS要求**:
- 响应式网格（3-4列）
- 卡片悬停效果
- 现代化设计

---

### 2️⃣ LibraryView.css
**路径**: `src/components/LibraryView.css`

**要求**:
```css
.library-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: var(--bg-secondary, #f5f5f5);
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.library-header h2 {
  font-size: 1.5rem;
  color: var(--text-primary, #333);
}

.toolbar {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.papers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  overflow-y: auto;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem;
  color: #999;
  font-size: 1.125rem;
}
```

---

### 3️⃣ PaperCard.tsx (论文卡片)
**路径**: `src/components/PaperCard.tsx`

**Props**:
```typescript
interface PaperCardProps {
  paper: PaperEntry
  onClick: () => void
}
```

**要求**:
- 显示论文标题、summary预览、日期
- 文件类型图标（PDF/TXT）
- 悬停效果
- 右键菜单（编辑、删除）

**代码框架**:
```typescript
import { PaperEntry } from '../types/library'
import './PaperCard.css'

interface PaperCardProps {
  paper: PaperEntry
  onClick: () => void
}

const PaperCard = ({ paper, onClick }: PaperCardProps) => {
  const icon = paper.fileType === 'pdf' ? '📕' : '📝'
  const preview = paper.summary?.slice(0, 150) || '暂无摘要'

  return (
    <div className="paper-card" onClick={onClick}>
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{paper.title}</h3>
      <p className="card-summary">{preview}...</p>
      <div className="card-footer">
        <span className="card-date">
          {new Date(paper.addedDate).toLocaleDateString('zh-CN')}
        </span>
      </div>
    </div>
  )
}

export default PaperCard
```

---

### 4️⃣ PaperCard.css
**要求**: 美观的卡片设计，白色背景，阴影，圆角

---

### 5️⃣ SummaryEditor.tsx (摘要编辑器)
**路径**: `src/components/SummaryEditor.tsx`

**要求**:
- Textarea编辑摘要
- 自动保存（防抖500ms）
- 字数统计
- Markdown支持提示

---

### 6️⃣ SummaryEditor.css
**要求**: 简洁的编辑器样式

---

### 7️⃣ MindMapView.tsx (思维导图)
**路径**: `src/components/MindMapView.tsx`

**要求**:
- 使用React Flow
- 自定义节点类型（主题、论文、笔记）
- 工具栏：添加节点、保存
- 双击论文节点打开阅读器

**代码框架**:
```typescript
import { useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import './MindMapView.css'

const MindMapView = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="mindmap-view">
      <div className="mindmap-toolbar">
        <button>+ 主题</button>
        <button>+ 论文</button>
        <button>💾 保存</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}

export default MindMapView
```

---

### 8️⃣ MindMapView.css
**要求**: 全屏布局，工具栏固定顶部

---

### 9️⃣ DesktopApp.tsx (主应用布局)
**路径**: `src/components/DesktopApp.tsx`

**要求**:
- 顶部导航栏
- 根据currentView显示不同组件
- 响应式布局

**代码框架**:
```typescript
import { useLibraryStore } from '../store/libraryStore'
import Navbar from './Navbar'
import LibraryView from './LibraryView'
import MindMapView from './MindMapView'
import PaperViewer from './PaperViewer'
import MarkdownEditor from './MarkdownEditor'
import './DesktopApp.css'

const DesktopApp = () => {
  const { currentView, selectedPaperId } = useLibraryStore()

  return (
    <div className="desktop-app">
      <Navbar />
      <main className="main-content">
        {currentView === 'library' && <LibraryView />}
        {currentView === 'mindmap' && <MindMapView />}
        {currentView === 'reading' && selectedPaperId && (
          <div className="reading-layout">
            <div className="left-panel">
              <PaperViewer />
            </div>
            <div className="right-panel">
              <MarkdownEditor />
            </div>
          </div>
        )}
        {currentView === 'notes-only' && <MarkdownEditor />}
      </main>
    </div>
  )
}

export default DesktopApp
```

---

### 🔟 DesktopApp.css
**要求**: Flex布局，全屏，无滚动

---

### 1️⃣1️⃣ Navbar.tsx (导航栏)
**路径**: `src/components/Navbar.tsx`

**要求**:
- Logo和标题
- 视图切换按钮（库、思维导图、阅读、笔记）
- 活动状态指示

**代码框架**:
```typescript
import { useLibraryStore } from '../store/libraryStore'
import './Navbar.css'

const Navbar = () => {
  const { currentView, setCurrentView } = useLibraryStore()

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>📚 论文管理器</h1>
      </div>
      <div className="nav-links">
        <button
          className={currentView === 'library' ? 'active' : ''}
          onClick={() => setCurrentView('library')}
        >
          📚 论文库
        </button>
        <button
          className={currentView === 'mindmap' ? 'active' : ''}
          onClick={() => setCurrentView('mindmap')}
        >
          🗺️ 思维导图
        </button>
        <button
          className={currentView === 'reading' ? 'active' : ''}
          onClick={() => setCurrentView('reading')}
        >
          📖 阅读
        </button>
        <button
          className={currentView === 'notes-only' ? 'active' : ''}
          onClick={() => setCurrentView('notes-only')}
        >
          📝 笔记
        </button>
      </div>
    </nav>
  )
}

export default Navbar
```

---

### 1️⃣2️⃣ Navbar.css
**要求**: 固定顶部，渐变背景

---

### 1️⃣3️⃣ vite.config.ts (更新)
**路径**: `vite.config.ts`

**完整代码**:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
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

### 1️⃣4️⃣ electron-vite.config.ts (新建)
**路径**: `electron-vite.config.ts`

**完整代码**:
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

### 1️⃣5️⃣ App.tsx (更新)
**路径**: `src/App.tsx`

**添加环境检测**:
```typescript
import { useEffect } from 'react'
import { useLibraryStore } from './store/libraryStore'
import DesktopApp from './components/DesktopApp'
import DictionaryPopup from './components/DictionaryPopup'
import { useAppStore } from './store/appStore'
import PaperViewer from './components/PaperViewer'
import MarkdownEditor from './components/MarkdownEditor'
import './App.css'

function App() {
  const { loadLibrary } = useLibraryStore()
  const { selectedWord, wordPosition } = useAppStore()

  useEffect(() => {
    if (window.electronAPI) {
      loadLibrary()
    }
  }, [loadLibrary])

  // Electron桌面版
  if (window.electronAPI) {
    return (
      <>
        <DesktopApp />
        {selectedWord && wordPosition && <DictionaryPopup />}
      </>
    )
  }

  // Web版（保持原样）
  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 双语论文阅读器 | Bilingual Paper Reader</h1>
        <div className="header-info">
          <span className="shortcut-hint">提示: 点击单词查看释义 | 按 Ctrl+Enter 插入到笔记</span>
        </div>
      </header>

      <div className="app-content">
        <PaperViewer />
        <MarkdownEditor />
      </div>

      {selectedWord && wordPosition && <DictionaryPopup />}
    </div>
  )
}

export default App
```

---

## 🎨 设计要求

### 配色方案
```css
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border: #e0e0e0;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### UI风格
- 现代、简洁、专业
- 卡片式设计
- 圆角8px
- 渐变按钮
- 流畅动画（transition 0.2s）

---

## ✅ 验收标准

1. 所有15个文件创建完成
2. 无TypeScript错误
3. UI美观现代
4. 功能符合需求
5. 代码注释清晰

---

## 🚀 开始开发

按文件顺序依次创建，每个文件包含完整代码和CSS样式。确保：
- 导入路径正确
- 类型定义准确
- 组件可独立运行
- 样式美观专业

**Good luck! 🎉**
