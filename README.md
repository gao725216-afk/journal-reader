# 📚 双语论文阅读器 | Bilingual Paper Reader

一个专为中国学生设计的经济学论文阅读工具，提供双屏对照、实时翻译、Markdown笔记和LaTeX公式支持。

## ✨ 核心功能

### 📖 双屏阅读模式
- **左侧**: 论文原文查看器，支持PDF和文本文件
- **右侧**: Markdown编辑器，支持LaTeX数学公式
- **同步滚动**: 左右面板可以同步滚动，便于对照阅读

### 🔍 智能词典
- **一键查词**: 点击任意英文单词即可查看释义
- **双语解释**: 同时显示中文和英文解释
- **快速插入**: 使用快捷键 `Ctrl+Enter` 将单词解释插入到笔记中

### ✍️ 强大的笔记功能
- **Markdown支持**: 使用Markdown语法记录笔记
- **LaTeX公式**: 支持行内和块级LaTeX数学公式
  - 行内公式: `$E = mc^2$`
  - 块级公式: `$$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$`
- **实时预览**: 在编辑和预览模式之间自由切换
- **一键导出**: 将笔记导出为Markdown文件

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📝 使用说明

### 1. 上传论文
- 点击左侧面板的"上传文件"按钮
- 选择论文文件（支持 .txt 和 .pdf 格式）
- 论文内容将显示在左侧面板
- PDF文件支持缩放和页面导航

### 2. 查看单词释义
- 点击论文中的任意英文单词
- 弹窗将显示该单词的中英文释义
- 可以使用以下快捷键：
  - `Ctrl+Enter` 或 `Cmd+Enter`: 插入单词解释到笔记
  - `ESC`: 关闭弹窗

### 3. 记录笔记
- 在右侧编辑器中使用Markdown语法记录笔记
- 支持LaTeX数学公式：
  ```markdown
  行内公式: $f(x) = x^2 + 2x + 1$

  块级公式:
  $$
  \sum_{i=1}^{n} i = \frac{n(n+1)}{2}
  $$
  ```
- 点击"预览"按钮查看渲染效果

### 4. 同步滚动
- 默认启用左右面板同步滚动
- 点击右侧面板的"🔗 已同步"按钮可以切换同步状态

### 5. 导出笔记
- 点击"💾 导出"按钮
- 笔记将以Markdown格式保存到本地

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **Markdown渲染**: react-markdown + remark-math + rehype-katex
- **数学公式**: KaTeX
- **样式**: CSS Modules

## 📁 项目结构

```
journal-reader/
├── src/
│   ├── components/
│   │   ├── PaperViewer.tsx      # 论文查看器
│   │   ├── PaperViewer.css
│   │   ├── MarkdownEditor.tsx   # Markdown编辑器
│   │   ├── MarkdownEditor.css
│   │   ├── DictionaryPopup.tsx  # 词典弹窗
│   │   └── DictionaryPopup.css
│   ├── store/
│   │   └── appStore.ts          # 全局状态管理
│   ├── App.tsx                  # 主应用组件
│   ├── App.css
│   ├── main.tsx                 # 应用入口
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎯 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Enter` / `Cmd+Enter` | 插入单词解释到笔记 |
| `ESC` | 关闭词典弹窗 |

## ✅ 新增功能 (v0.2.0)

- ✅ **PDF直接支持**: 可以直接上传和阅读PDF文件
- ✅ **PDF文本层**: 支持在PDF中点击单词查询
- ✅ **PDF缩放控制**: 支持放大、缩小和重置视图
- ✅ **多页面显示**: 自动渲染所有PDF页面

## 🔮 未来计划

- [ ] 真实词典API集成（有道、百度翻译等）
- [ ] 本地词典数据库支持
- [ ] 更多笔记模板
- [ ] 云端同步功能
- [ ] 深色模式
- [ ] 多语言界面支持

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 License

MIT

## 💡 提示

### PDF文件支持

现在你可以直接上传PDF文件了！功能包括：

1. **查看PDF**：完整的PDF渲染，保持原始格式
2. **点击查词**：在PDF文本上点击即可查询单词
3. **缩放控制**：使用缩放按钮调整视图大小
4. **同步滚动**：PDF查看器与笔记同步滚动

### 如果需要文本格式

如果你更喜欢纯文本格式，可以：

1. **从PDF提取文本**:
   - 使用Adobe Acrobat Reader的"导出为文本"功能
   - 使用在线工具如 pdftotext
   - 使用Python: `pdfplumber` 或 `PyPDF2`

2. **示例代码**:
   ```python
   import pdfplumber

   with pdfplumber.open('paper.pdf') as pdf:
       text = ''
       for page in pdf.pages:
           text += page.extract_text()

       with open('paper.txt', 'w', encoding='utf-8') as f:
           f.write(text)
   ```

### LaTeX公式示例

经济学中常用的LaTeX公式：

```markdown
# 需求函数
$Q_d = a - bP$

# 供给函数
$Q_s = c + dP$

# 效用最大化
$$
\max_{x,y} U(x,y) \text{ subject to } P_x x + P_y y = M
$$

# 生产函数（Cobb-Douglas）
$$
Y = A K^\alpha L^{1-\alpha}
$$

# 边际效用
$$
MU_x = \frac{\partial U}{\partial x}
$$
```

## 📧 联系方式

如有问题或建议，欢迎通过GitHub Issues联系。

---

Made with ❤️ for economics students
