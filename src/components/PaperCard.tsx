import React from 'react'
import { PaperEntry } from '../types/library'
import './PaperCard.css'

interface PaperCardProps {
  paper: PaperEntry
  onClick: () => void
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, onClick }) => {
  const icon = paper.fileType === 'pdf' ? '📕' : '📝'
  const hasSummary = paper.summary && paper.summary.length > 0
  const preview = hasSummary
    ? (paper.summary!.length > 120 ? paper.summary!.slice(0, 120) + '...' : paper.summary)
    : '暂无摘要，点击进入阅读模式添加...'

  const dateStr = new Date(paper.addedDate).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  return (
    <div className="paper-card" onClick={onClick}>
      <div className="card-header">
        <div className="file-icon">{icon}</div>
        <div className="file-type">{paper.fileType.toUpperCase()}</div>
      </div>

      <div className="card-body">
        <h3 className="card-title" title={paper.title}>{paper.title}</h3>
        <p className={`card-summary ${!hasSummary ? 'empty' : ''}`}>
          {preview}
        </p>
      </div>

      <div className="card-footer">
        <span className="card-date">📅 {dateStr}</span>
        {paper.tags && paper.tags.length > 0 && (
          <div className="card-tags">
            {paper.tags.slice(0, 2).map(tag => (
              <span key={tag} className="tag-dot" style={{backgroundColor: '#667eea'}}></span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PaperCard
