import { useState } from 'react'
import PaperViewer from './components/PaperViewer'
import MarkdownEditor from './components/MarkdownEditor'
import DictionaryPopup from './components/DictionaryPopup'
import { useAppStore } from './store/appStore'
import './App.css'

function App() {
  const { selectedWord, wordPosition } = useAppStore()

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

      {selectedWord && wordPosition && (
        <DictionaryPopup />
      )}
    </div>
  )
}

export default App
