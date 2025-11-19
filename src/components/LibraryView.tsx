import { useState } from 'react'
import { useLibraryStore } from '../store/libraryStore'
import PaperCard from './PaperCard'
import './LibraryView.css'

const LibraryView = () => {
  const { papers, addPaper, setSelectedPaper, setCurrentView } = useLibraryStore()
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddPaper = async () => {
    try {
      const filePath = await window.electronAPI.selectPdfFile()
      if (filePath) {
        // 简单的文件名提取逻辑
        const fileName = filePath.split(/[\\/]/).pop() || 'Untitled'
        const title = fileName.replace(/\.(pdf|txt)$/, '')

        const paper = {
          id: crypto.randomUUID(),
          title: title,
          filePath,
          fileType: filePath.endsWith('.pdf') ? 'pdf' : 'text' as 'pdf' | 'text',
          summary: '',
          notesPath: filePath.replace(/\.(pdf|txt)$/, '_notes.md'),
          tags: [],
          addedDate: new Date(),
          lastModified: new Date(),
        }
        addPaper(paper)
      }
    } catch (error) {
      console.error('Failed to add paper:', error)
    }
  }

  const handlePaperClick = (paperId: string) => {
    setSelectedPaper(paperId)
    setCurrentView('reading')
  }

  const filteredPapers = papers.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="library-view">
      <header className="library-header">
        <div className="header-left">
          <h2>📚 我的论文库</h2>
          <span className="paper-count">{papers.length} 篇论文</span>
        </div>
        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 搜索论文..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleAddPaper} className="btn-primary">
            + 添加论文
          </button>
        </div>
      </header>

      <div className="papers-grid">
        {filteredPapers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>{searchTerm ? '未找到匹配的论文' : '论文库是空的'}</h3>
            <p>{searchTerm ? '尝试更简单的关键词' : '点击右上角按钮开始添加你的第一篇论文'}</p>
          </div>
        ) : (
          filteredPapers.map(paper => (
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
