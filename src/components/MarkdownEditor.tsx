import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { useAppStore } from '../store/appStore'
import './MarkdownEditor.css'

const MarkdownEditor = () => {
  const [isEditing, setIsEditing] = useState(true)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  const {
    markdownContent,
    setMarkdownContent,
    leftScrollRatio,
    setRightScrollRatio,
    syncScrollEnabled,
    toggleSyncScroll,
  } = useAppStore()

  // 处理滚动
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (!syncScrollEnabled) return

    setIsUserScrolling(true)

    const target = e.currentTarget
    const { scrollTop, scrollHeight, clientHeight } = target
    const maxScroll = scrollHeight - clientHeight
    const ratio = maxScroll > 0 ? scrollTop / maxScroll : 0

    setRightScrollRatio(ratio)

    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // 设置新的定时器
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false)
    }, 150)
  }

  // 同步左侧滚动
  useEffect(() => {
    if (isUserScrolling || !syncScrollEnabled) return

    const target = isEditing ? editorRef.current : previewRef.current
    if (!target) return

    const { scrollHeight, clientHeight } = target
    const maxScroll = scrollHeight - clientHeight
    const targetScroll = leftScrollRatio * maxScroll

    target.scrollTop = targetScroll
  }, [leftScrollRatio, isUserScrolling, isEditing, syncScrollEnabled])

  // 导出笔记
  const handleExport = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `paper-notes-${new Date().toISOString().split('T')[0]}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 清空笔记
  const handleClear = () => {
    if (confirm('确定要清空所有笔记吗？')) {
      setMarkdownContent('# 论文笔记\n\n')
    }
  }

  return (
    <div className="markdown-editor">
      <div className="editor-header">
        <h2>✍️ 笔记 (支持 LaTeX)</h2>
        <div className="editor-controls">
          <button
            className={`control-btn ${syncScrollEnabled ? 'active' : ''}`}
            onClick={toggleSyncScroll}
            title="切换同步滚动"
          >
            🔗 {syncScrollEnabled ? '已同步' : '未同步'}
          </button>
          <button
            className={`control-btn ${isEditing ? 'active' : ''}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? '📝 编辑' : '👁️ 预览'}
          </button>
          <button className="control-btn" onClick={handleExport}>
            💾 导出
          </button>
          <button className="control-btn danger" onClick={handleClear}>
            🗑️ 清空
          </button>
        </div>
      </div>

      <div className="editor-content">
        {isEditing ? (
          <textarea
            ref={editorRef}
            className="editor-textarea"
            value={markdownContent}
            onChange={(e) => setMarkdownContent(e.target.value)}
            onScroll={handleScroll}
            placeholder="在这里记录你的笔记...

支持 Markdown 语法和 LaTeX 数学公式：
- 行内公式：$E = mc^2$
- 块级公式：$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

提示：点击左侧论文中的单词，按 Ctrl+Enter 可快速插入单词解释"
          />
        ) : (
          <div
            ref={previewRef}
            className="editor-preview"
            onScroll={handleScroll}
          >
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className="editor-footer">
        <span className="word-count">
          字数: {markdownContent.length} | 行数: {markdownContent.split('\n').length}
        </span>
        <span className="latex-hint">
          LaTeX 示例: $f(x) = x^2$ 或 $$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$
        </span>
      </div>
    </div>
  )
}

export default MarkdownEditor
