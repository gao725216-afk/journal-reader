import { useEffect } from 'react'
import { useLibraryStore } from './store/libraryStore'
import DesktopApp from './components/DesktopApp'
import DictionaryPopup from './components/DictionaryPopup'
import PaperViewer from './components/PaperViewer'
import MarkdownEditor from './components/MarkdownEditor'
import { useAppStore } from './store/appStore'
import './App.css'

function App() {
  const { loadLibrary } = useLibraryStore()
  const { selectedWord, wordPosition } = useAppStore()

  useEffect(() => {
    // 检查是否在 Electron 环境下
    if (window.electronAPI) {
      console.log('Electron Environment Detected: Loading Library...')
      loadLibrary()
    }
  }, [loadLibrary])

  // --- 桌面版布局 (Electron) ---
  if (window.electronAPI) {
    return (
      <>
        <DesktopApp />
        {selectedWord && wordPosition && <DictionaryPopup />}
      </>
    )
  }

  // --- 网页版布局 (Fallback / Web Demo) ---
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
