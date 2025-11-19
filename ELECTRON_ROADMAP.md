# 🚀 Electron桌面版开发路线图

## ✅ 已完成 (v0.3.0 - 基础框架)

### 1. 项目配置
- ✅ 更新package.json添加Electron依赖
- ✅ 配置electron-builder打包
- ✅ 添加ReactFlow思维导图库
- ✅ 配置TypeScript类型

### 2. Electron核心
- ✅ 创建主进程 (`electron/main.ts`)
  - 窗口管理
  - 文件系统操作API
  - IPC通信处理
- ✅ 创建预加载脚本 (`electron/preload.ts`)
  - 安全的API暴露
  - TypeScript类型定义

### 3. 数据层
- ✅ 定义数据类型 (`src/types/library.ts`)
  - PaperEntry - 论文条目
  - MindMap - 思维导图
  - ViewMode - 视图模式
- ✅ 创建状态管理 (`src/store/libraryStore.ts`)
  - 论文CRUD
  - 思维导图管理
  - 持久化存储

## 🔨 当前进度

已完成核心架构设计，包括：
- Electron主进程和IPC通信
- 完整的数据结构定义
- 论文库状态管理
- 文件系统操作API

**现状**: 框架已搭建，可以开始UI开发

## 📋 下一步计划

### 阶段1: 基础UI组件 (1-2天)
1. **论文库视图** (`src/components/LibraryView.tsx`)
   - 论文列表展示
   - 添加/删除论文
   - 搜索和筛选

2. **论文卡片** (`src/components/PaperCard.tsx`)
   - 显示论文信息
   - Summary预览
   - 快速操作按钮

3. **Summary编辑器** (`src/components/SummaryEditor.tsx`)
   - Markdown编辑
   - 实时预览
   - 自动保存

### 阶段2: 思维导图 (2-3天)
4. **思维导图视图** (`src/components/MindMapView.tsx`)
   - React Flow集成
   - 节点类型定义
   - 拖拽交互

5. **思维导图节点** (`src/components/MindMapNode.tsx`)
   - 自定义节点样式
   - 论文节点特殊显示
   - 交互功能

### 阶段3: 布局整合 (1-2天)
6. **桌面应用主组件** (`src/components/DesktopApp.tsx`)
   - 多视图布局
   - 视图切换
   - 响应式设计

7. **更新主App** (`src/App.tsx`)
   - 检测运行环境
   - Web/Desktop双模式
   - 路由管理

### 阶段4: 构建配置 (1天)
8. **Electron Vite配置** (`electron-vite.config.ts`)
   - 主进程编译
   - 预加载脚本编译
   - 渲染进程配置

9. **Vite配置更新** (`vite.config.ts`)
   - Electron插件
   - 构建优化

### 阶段5: 测试和打包 (1-2天)
10. **测试**
    - 功能测试
    - 文件操作测试
    - 性能优化

11. **打包发布**
    - Windows安装包
    - 图标和资源
    - 发布说明

## 💻 完整代码示例预览

### 简化版论文库视图
```typescript
// src/components/LibraryView.tsx
export const LibraryView = () => {
  const { papers, addPaper, updatePaper } = useLibraryStore()

  const handleAddPaper = async () => {
    const filePath = await window.electronAPI.selectPdfFile()
    if (filePath) {
      const paper: PaperEntry = {
        id: generateId(),
        title: extractTitle(filePath),
        filePath,
        fileType: 'pdf',
        summary: '',
        notesPath: filePath.replace('.pdf', '_notes.md'),
        tags: [],
        addedDate: new Date(),
        lastModified: new Date(),
      }
      addPaper(paper)
    }
  }

  return (
    <div className="library-view">
      <header>
        <h2>📚 论文库</h2>
        <button onClick={handleAddPaper}>+ 添加论文</button>
      </header>
      <div className="papers-grid">
        {papers.map(paper => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
    </div>
  )
}
```

### 简化版思维导图
```typescript
// src/components/MindMapView.tsx
import ReactFlow from 'reactflow'

export const MindMapView = () => {
  const { getMindMap, updateMindMap } = useLibraryStore()
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  return (
    <div className="mindmap-view">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
}
```

## 🎯 最终目标

创建一个功能完整的Windows桌面应用：

### 核心功能
- ✅ PDF论文阅读
- ✅ Markdown笔记
- ✅ 单词查询
- 🔨 论文库管理
- 🔨 思维导图
- 🔨 Summary编辑
- 🔨 多视图布局

### 用户体验
- 📂 选择论文文件夹，自动导入
- 🗺️ 可视化论文关系
- 📝 笔记自动关联
- 💾 数据本地持久化
- 🔍 快速搜索和筛选

## 📊 时间估算

| 阶段 | 任务 | 预计时间 |
|------|------|---------|
| 1 | 基础UI组件 | 1-2天 |
| 2 | 思维导图 | 2-3天 |
| 3 | 布局整合 | 1-2天 |
| 4 | 构建配置 | 1天 |
| 5 | 测试打包 | 1-2天 |
| **总计** | | **6-10天** |

## 🚀 快速启动

### 当前可以做的：
```bash
# 1. 安装依赖
npm install

# 2. Web版开发（现有功能正常工作）
npm run dev

# 3. 查看已创建的文件
ls electron/          # Electron主进程
ls src/types/         # 类型定义
ls src/store/         # 状态管理
```

### 等待完成的：
- UI组件实现
- Electron配置文件
- 桌面版启动

## 💡 建议

### 选项A: 分阶段开发
1. 先完成论文库UI
2. 然后添加思维导图
3. 最后整合所有功能

### 选项B: 继续完善Web版
1. 优化现有PDF阅读功能
2. 改进词典API
3. 添加更多笔记功能

### 选项C: 混合开发
1. 保持Web版可用
2. 逐步添加桌面版功能
3. 支持两种运行模式

## 📞 需要帮助？

我已经为你创建了：
1. ✅ 完整的Electron框架
2. ✅ 数据结构和状态管理
3. ✅ IPC通信API
4. ✅ 开发路线图

**下一步你需要决定：**
- 是否继续完成所有桌面版组件？
- 或者先测试现有框架？
- 还是需要我提供特定组件的完整代码？

告诉我你的选择，我会继续帮助你！🚀
