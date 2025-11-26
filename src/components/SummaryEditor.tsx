import { useState, useEffect } from 'react'
import { useLibraryStore } from '../store/libraryStore'
import './SummaryEditor.css'

const SummaryEditor = () => {
  const { papers, selectedPaperId, updatePaper, saveLibrary } = useLibraryStore()

  const paper = papers.find(p => p.id === selectedPaperId)
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // 初始化内容
  useEffect(() => {
    if (paper) {
      setContent(paper.summary || '')
    }
  }, [paper?.id])

  // 防抖保存逻辑
  useEffect(() => {
    if (!paper || content === paper.summary) return

    setIsSaving(true)
    const timeoutId = setTimeout(() => {
      updatePaper(paper.id, { summary: content })
      saveLibrary()
      setIsSaving(false)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [content, paper, updatePaper, saveLibrary])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  if (!paper) return <div className="summary-empty">未选择论文</div>

  return (
    <div className="summary-editor-container">
      <div className="editor-header">
        <span className="editor-title">📝 摘要 & 思考</span>
        <div className="editor-status">
          {isSaving ? <span className="saving">保存中...</span> : <span className="saved">已保存</span>}
          <span className="word-count">{content.length} 字</span>
        </div>
      </div>
      <textarea
        className="summary-textarea"
        value={content}
        onChange={handleChange}
        placeholder="在此输入论文摘要、核心观点或你的思考 (支持Markdown)..."
      />
    </div>
  )
}

export default SummaryEditor
