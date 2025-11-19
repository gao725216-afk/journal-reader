# 📚 论文管理器桌面版 - 完整实现指南

## 🎯 新功能概述

将现有的Web应用升级为功能强大的Windows桌面应用，包括：

### ✨ 核心新功能
1. **论文库管理** - 管理本地论文文件夹
2. **思维导图** - 可视化论文关系和笔记结构
3. **智能关联** - 论文与笔记自动关联
4. **Summary编辑** - 每篇论文独立摘要
5. **多视图模式** - 思维导图/阅读模式/笔记模式

## 📦 已完成的工作

### 1. 依赖配置
已更新 `package.json` 添加：
- **Electron** - 桌面应用框架
- **Electron-Builder** - 打包工具
- **React Flow** - 思维导图库
- **Electron-Vite** - 开发工具

### 2. Electron主进程
已创建 `electron/main.ts` 包含：
- 窗口管理
- 文件系统操作（选择目录、读写文件）
- IPC通信处理
- 论文库数据持久化

### 3. 数据结构
已创建 `src/types/library.ts` 定义：
- `PaperEntry` - 论文条目
- `MindMap` - 思维导图
- `PaperLibrary` - 论文库
- `ViewMode` - 视图模式

### 4. 状态管理
已创建 `src/store/libraryStore.ts` 实现：
- 论文CRUD操作
- 思维导图管理
- 目录管理
- 数据持久化

## 🚀 接下来需要创建的组件

### 1. 思维导图组件 (`src/components/MindMapView.tsx`)
```typescript
功能：
- 使用React Flow渲染思维导图
- 节点可以是主题、论文或笔记
- 拖拽创建和连接节点
- 点击论文节点打开阅读器
```

### 2. 论文库视图 (`src/components/LibraryView.tsx`)
```typescript
功能：
- 显示所有论文列表
- 搜索和筛选功能
- 论文卡片显示摘要
- 添加/删除论文
```

### 3. 多视图布局 (`src/components/DesktopApp.tsx`)
```typescript
功能：
- 左侧：论文库/思维导图切换
- 中间：PDF阅读器
- 右侧：笔记编辑器/Summary编辑器
```

### 4. Summary编辑器 (`src/components/SummaryEditor.tsx`)
```typescript
功能：
- 快速编辑论文摘要
- Markdown格式支持
- 自动保存
```

### 5. Vite配置更新 (`vite.config.ts`)
```typescript
需要配置：
- Electron插件
- 构建输出路径
- 开发服务器设置
```

## 📝 完整实现步骤

### 步骤1: 安装依赖
```bash
npm install
```

### 步骤2: 创建剩余组件
需要创建以下文件（我将在下一个回复中提供完整代码）：

1. `src/components/MindMapView.tsx` - 思维导图视图
2. `src/components/LibraryView.tsx` - 论文库视图
3. `src/components/DesktopApp.tsx` - 桌面应用主组件
4. `src/components/SummaryEditor.tsx` - 摘要编辑器
5. `src/components/PaperCard.tsx` - 论文卡片组件
6. `electron-vite.config.ts` - Electron Vite配置
7. 更新 `src/App.tsx` - 支持桌面/Web双模式

### 步骤3: 配置构建
```bash
# 开发模式（Electron）
npm run dev:electron

# 构建Windows应用
npm run build

# 仅构建（不打包）
npm run build:dir
```

### 步骤4: 打包发布
```bash
# 完整打包
npm run build

# 输出位置
release/0.3.0/Journal Reader Setup 0.3.0.exe
```

## 🎨 UI/UX设计

### 主界面布局
```
┌─────────────────────────────────────────────────────────┐
│  论文管理器                                     [_ □ ✕]  │
├─────────────────────────────────────────────────────────┤
│ [库] [思维导图] [阅读] [笔记]                           │
├──────────┬────────────────────────┬─────────────────────┤
│          │                        │                     │
│  论文库   │     PDF阅读器          │    笔记编辑器        │
│          │                        │                     │
│  [📕论文1] │                        │  # 论文笔记          │
│  [📕论文2] │                        │                     │
│  [📕论文3] │                        │  - 要点1             │
│          │                        │  - 要点2             │
│  [+新增]  │     [🔍±] [页数]        │                     │
│          │                        │  [编辑/预览]         │
└──────────┴────────────────────────┴─────────────────────┘
```

### 思维导图视图
```
┌─────────────────────────────────────────────────────────┐
│  论文管理器 - 思维导图                          [_ □ ✕]  │
├─────────────────────────────────────────────────────────┤
│ [库] [思维导图] [阅读] [笔记]        [新建] [保存]       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│         ┌──────┐                                        │
│         │ 主题  │                                        │
│         └───┬──┘                                        │
│             │                                           │
│      ┌──────┴──────┐                                    │
│   ┌──┴──┐      ┌──┴──┐                                 │
│   │论文1 │      │论文2 │                                 │
│   └─────┘      └─────┘                                 │
│                                                         │
│  工具: [+主题] [+论文] [+笔记] [连接]                     │
└─────────────────────────────────────────────────────────┘
```

## 🔑 关键特性

### 1. 自动文件关联
- 上传PDF时自动创建对应的`.md`笔记文件
- 笔记文件命名: `{pdf_name}_notes.md`
- 保存在同一目录

### 2. Summary管理
- 每篇论文的summary存储在库数据中
- 支持Markdown格式
- 在论文卡片上显示摘要预览

### 3. 思维导图功能
- 拖拽论文到思维导图
- 论文节点显示标题和摘要
- 双击节点打开论文阅读器
- 自动保存思维导图布局

### 4. 多视图切换
- **库视图**: 管理所有论文
- **思维导图**: 可视化组织
- **阅读视图**: PDF+笔记双屏
- **笔记视图**: 仅显示笔记

## 📊 数据持久化

### 存储位置
- Windows: `C:\Users\{Username}\AppData\Roaming\journal-reader\library.json`
- 包含所有论文元数据、思维导图数据

### 数据结构示例
```json
{
  "papers": [
    {
      "id": "uuid-1",
      "title": "Economic Growth Theory",
      "filePath": "C:/Papers/growth.pdf",
      "fileType": "pdf",
      "summary": "本文研究经济增长的核心理论...",
      "notesPath": "C:/Papers/growth_notes.md",
      "tags": ["economics", "growth"],
      "addedDate": "2025-01-01",
      "lastModified": "2025-01-02"
    }
  ],
  "mindMaps": [
    {
      "id": "map-1",
      "name": "经济学研究框架",
      "nodes": [...],
      "edges": [...]
    }
  ],
  "directories": ["C:/Papers", "D:/Research"]
}
```

## 🛠️ 开发工具链

### 技术栈
- **前端**: React 18 + TypeScript
- **桌面**: Electron 28
- **打包**: Electron Builder
- **构建**: Vite + Electron Vite
- **状态**: Zustand
- **思维导图**: React Flow
- **PDF**: PDF.js
- **Markdown**: React-Markdown + KaTeX

### 开发命令
```bash
# Web开发模式
npm run dev

# Electron开发模式
npm run dev:electron

# 类型检查
npm run lint

# 构建Web版
npm run build

# 构建桌面版
npm run build

# 构建但不打包
npm run build:dir
```

## 🎯 下一步行动

我已经为你创建了完整的框架和核心逻辑。现在需要：

1. **创建剩余的UI组件**（我将在下一个回复中提供）
2. **更新Vite配置**支持Electron
3. **创建electron-vite配置文件**
4. **更新主App组件**整合所有功能
5. **测试和调试**

你想让我继续创建剩余的组件代码吗？还是你有其他问题或需要调整的地方？
