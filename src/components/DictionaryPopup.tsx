import { useEffect, useCallback } from 'react'
import { useAppStore } from '../store/appStore'
import './DictionaryPopup.css'

const DictionaryPopup = () => {
  const {
    selectedWord,
    wordPosition,
    wordDefinition,
    setSelectedWord,
    insertWordToNotes,
  } = useAppStore()

  // 关闭弹窗
  const closePopup = useCallback(() => {
    setSelectedWord(null, null)
  }, [setSelectedWord])

  // 插入到笔记
  const handleInsert = useCallback(() => {
    if (wordDefinition) {
      insertWordToNotes(wordDefinition)
      closePopup()
    }
  }, [wordDefinition, insertWordToNotes, closePopup])

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC 关闭弹窗
      if (e.key === 'Escape') {
        closePopup()
      }
      // Ctrl+Enter 或 Cmd+Enter 插入到笔记
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleInsert()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closePopup, handleInsert])

  // 点击外部关闭弹窗
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup()
    }
  }

  if (!selectedWord || !wordPosition) {
    return null
  }

  // 计算弹窗位置
  const popupStyle: React.CSSProperties = {
    position: 'fixed',
    left: `${wordPosition.x}px`,
    top: `${wordPosition.y}px`,
    transform: 'translate(-50%, -100%)',
    marginTop: '-10px',
  }

  return (
    <>
      <div className="popup-backdrop" onClick={handleBackdropClick} />
      <div className="dictionary-popup" style={popupStyle}>
        <div className="popup-header">
          <h3>{selectedWord}</h3>
          <button className="close-btn" onClick={closePopup}>
            ✕
          </button>
        </div>

        {wordDefinition ? (
          <div className="popup-content">
            {wordDefinition.phonetic && (
              <div className="phonetic">{wordDefinition.phonetic}</div>
            )}

            <div className="definition-section">
              <div className="definition-label">🇨🇳 中文</div>
              <div className="definition-text">{wordDefinition.chinese}</div>
            </div>

            <div className="definition-section">
              <div className="definition-label">🇬🇧 English</div>
              <div className="definition-text">{wordDefinition.english}</div>
            </div>

            <div className="popup-actions">
              <button className="action-btn primary" onClick={handleInsert}>
                <span className="shortcut">Ctrl+Enter</span>
                插入到笔记
              </button>
              <button className="action-btn" onClick={closePopup}>
                <span className="shortcut">ESC</span>
                关闭
              </button>
            </div>
          </div>
        ) : (
          <div className="popup-loading">
            <div className="spinner"></div>
            <span>查询中...</span>
          </div>
        )}
      </div>
    </>
  )
}

export default DictionaryPopup
