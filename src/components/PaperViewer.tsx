import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/appStore'
import PDFViewer from './PDFViewer'
import './PaperViewer.css'

const PaperViewer = () => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<'text' | 'pdf' | null>(null)

  const {
    paperContent,
    setPaperContent,
    setSelectedWord,
    setWordDefinition,
    rightScrollRatio,
    setLeftScrollRatio,
    syncScrollEnabled,
  } = useAppStore()

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const text = await file.text()
      setPaperContent(text)
      setPdfFile(null)
      setFileType('text')
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setPdfFile(file)
      setPaperContent('')
      setFileType('pdf')
    } else {
      alert('不支持的文件格式。请上传 .txt 或 .pdf 文件。')
    }
  }

  // 处理单词点击
  const handleWordClick = async (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const word = target.textContent?.trim()

    if (!word || word.length === 0) return

    // 只选择单个单词（去除标点符号）
    const cleanWord = word.replace(/[.,;:!?"""''()]/g, '')
    if (cleanWord.length === 0) return

    // 获取点击位置
    const rect = target.getBoundingClientRect()
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top,
    }

    setSelectedWord(cleanWord, position)

    // 模拟查询词典（这里使用简单的模拟数据）
    // 实际应用中应该调用真实的词典API
    const definition = await fetchWordDefinition(cleanWord)
    setWordDefinition(definition)
  }

  // 处理滚动
  const handleScroll = () => {
    if (!contentRef.current || !syncScrollEnabled) return

    setIsUserScrolling(true)

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current
    const maxScroll = scrollHeight - clientHeight
    const ratio = maxScroll > 0 ? scrollTop / maxScroll : 0

    setLeftScrollRatio(ratio)

    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // 设置新的定时器
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false)
    }, 150)
  }

  // 同步右侧滚动
  useEffect(() => {
    if (!contentRef.current || isUserScrolling || !syncScrollEnabled) return

    const { scrollHeight, clientHeight } = contentRef.current
    const maxScroll = scrollHeight - clientHeight
    const targetScroll = rightScrollRatio * maxScroll

    contentRef.current.scrollTop = targetScroll
  }, [rightScrollRatio, isUserScrolling, syncScrollEnabled])

  // 处理PDF单词点击
  const handlePdfWordClick = async (word: string, position: { x: number; y: number }) => {
    const cleanWord = word.replace(/[.,;:!?"""''()]/g, '')
    if (cleanWord.length === 0) return

    setSelectedWord(cleanWord, position)
    const definition = await fetchWordDefinition(cleanWord)
    setWordDefinition(definition)
  }

  return (
    <div className="paper-viewer">
      <div className="viewer-header">
        <h2>📄 论文原文</h2>
        <div className="viewer-controls">
          <label className="upload-btn">
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            上传文件
          </label>
          {fileType && (
            <span className="file-type-badge">
              {fileType === 'pdf' ? '📕 PDF' : '📝 TXT'}
            </span>
          )}
        </div>
      </div>

      {fileType === 'pdf' && pdfFile ? (
        <PDFViewer file={pdfFile} onWordClick={handlePdfWordClick} />
      ) : fileType === 'text' ? (
        <div
          ref={contentRef}
          className="viewer-content"
          onScroll={handleScroll}
        >
          {paperContent ? (
            <div className="text-content" onClick={handleWordClick}>
              {paperContent.split(/(\s+)/).map((segment, index) => {
                // 如果是空白字符，直接返回
                if (/^\s+$/.test(segment)) {
                  return <span key={index}>{segment}</span>
                }
                // 否则，每个单词都可以点击
                return (
                  <span key={index} className="word" data-word={segment}>
                    {segment}
                  </span>
                )
              })}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="viewer-content">
          <div className="empty-state">
            <p>📂 请上传论文文件开始阅读</p>
            <p className="hint">支持 .txt 和 .pdf 格式文件</p>
          </div>
        </div>
      )}
    </div>
  )
}

// 模拟词典查询（实际应用中应该调用真实API）
async function fetchWordDefinition(word: string) {
  // 这里使用一个简单的模拟
  // 实际应用中，你可以集成有道词典API、百度翻译API等

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // 简单的模拟数据
  const mockDefinitions: { [key: string]: any } = {
    'economy': {
      word: 'economy',
      phonetic: '/ɪˈkɒnəmi/',
      chinese: '经济；节约',
      english: 'the system by which a country\'s money and goods are produced and used',
    },
    'market': {
      word: 'market',
      phonetic: '/ˈmɑːkɪt/',
      chinese: '市场；集市',
      english: 'a place where people buy and sell goods',
    },
    'price': {
      word: 'price',
      phonetic: '/praɪs/',
      chinese: '价格；代价',
      english: 'the amount of money for which something is sold',
    },
  }

  const lowerWord = word.toLowerCase()

  if (mockDefinitions[lowerWord]) {
    return mockDefinitions[lowerWord]
  }

  // 默认返回
  return {
    word: word,
    phonetic: '',
    chinese: '（词典中未找到，建议使用在线词典）',
    english: 'Definition not found in dictionary',
  }
}

export default PaperViewer
