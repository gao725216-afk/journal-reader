# 📚 双语论文阅读器 - 桌面版

一个专为经济学论文设计的智能阅读和管理工具。

## ✨ 核心功能

- 📕 **PDF直接阅读** - 支持PDF和文本文件
- 📝 **Markdown笔记** - 支持LaTeX数学公式
- 🔍 **单词查询** - 点击查看中英文释义
- 🗺️ **思维导图** - 可视化组织论文关系
- 💾 **自动保存** - 数据本地持久化
- 📊 **论文管理** - 库管理、搜索、分类

## 🚀 一键安装（Windows）

### 方法1: 使用安装脚本（推荐）

1. **下载项目**
   ```bash
   git clone <你的仓库地址>
   cd journal-reader
   ```

2. **双击运行**
   ```
   install.bat   # 自动安装所有依赖
   start.bat     # 启动应用
   ```

### 方法2: 手动安装

```bash
# 1. 安装依赖
npm install

# 2. 启动应用
npm run dev:electron
```

## 📖 使用说明

### 快速开始

1. **启动应用**：双击 `start.bat`
2. **添加论文**：点击"+ 添加论文"选择PDF文件
3. **开始阅读**：点击论文卡片进入阅读模式
4. **记笔记**：右侧编辑器支持Markdown和LaTeX

### 界面说明

- **📚 论文库**：管理所有论文
- **🗺️ 思维导图**：可视化组织笔记
- **📖 阅读模式**：PDF + 笔记双栏
- **📝 纯笔记**：专注笔记编辑

## 🎯 快捷键

- `Ctrl+Enter` - 插入单词解释到笔记
- `ESC` - 关闭词典弹窗

## 🛠️ 技术栈

- React 18 + TypeScript
- Electron 28
- React Flow (思维导图)
- PDF.js
- Zustand (状态管理)

## 📦 打包发布

```bash
npm run build
```

输出：`release/0.3.0/Journal Reader Setup 0.3.0.exe`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT

---

**版本**: v0.3.0 | **开发**: Claude + Gemini AI
