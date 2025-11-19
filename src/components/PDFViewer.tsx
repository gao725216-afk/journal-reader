import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { useAppStore } from '../store/appStore'
import './PDFViewer.css'

// 配置PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

interface PDFViewerProps {
  file: File
  onWordClick: (word: string, position: { x: number; y: number }) => void
}

const PDFViewer = ({ file, onWordClick }: PDFViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.5)
  const [loading, setLoading] = useState(true)
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map())
  const textLayerRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const {
    rightScrollRatio,
    setLeftScrollRatio,
    syncScrollEnabled,
  } = useAppStore()

  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  // 加载PDF文档
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true)
        const arrayBuffer = await file.arrayBuffer()
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
        const pdf = await loadingTask.promise
        setPdfDoc(pdf)
        setNumPages(pdf.numPages)
        setLoading(false)
      } catch (error) {
        console.error('Error loading PDF:', error)
        setLoading(false)
      }
    }

    loadPDF()
  }, [file])

  // 渲染PDF页面
  useEffect(() => {
    if (!pdfDoc || !containerRef.current) return

    const renderPage = async (pageNum: number) => {
      try {
        const page = await pdfDoc.getPage(pageNum)
        const viewport = page.getViewport({ scale })

        // 创建canvas容器
        const pageContainer = document.createElement('div')
        pageContainer.className = 'pdf-page-container'
        pageContainer.setAttribute('data-page-number', pageNum.toString())

        // 渲染canvas
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width
        canvas.className = 'pdf-canvas'

        if (context) {
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          }
          await page.render(renderContext).promise
        }

        pageContainer.appendChild(canvas)
        canvasRefs.current.set(pageNum, canvas)

        // 创建文本层
        const textLayerDiv = document.createElement('div')
        textLayerDiv.className = 'pdf-text-layer'
        textLayerDiv.style.width = `${viewport.width}px`
        textLayerDiv.style.height = `${viewport.height}px`

        pageContainer.appendChild(textLayerDiv)
        textLayerRefs.current.set(pageNum, textLayerDiv)

        // 渲染文本层
        const textContent = await page.getTextContent()

        // 使用简化的文本渲染方式
        textContent.items.forEach((item: any) => {
          if (item.str) {
            const textDiv = document.createElement('div')
            textDiv.className = 'pdf-text-item'
            textDiv.textContent = item.str

            // 设置位置和样式
            const tx = pdfjsLib.Util.transform(
              viewport.transform,
              item.transform
            )

            textDiv.style.left = `${tx[4]}px`
            textDiv.style.top = `${tx[5]}px`
            textDiv.style.fontSize = `${item.height}px`
            textDiv.style.fontFamily = item.fontName || 'sans-serif'

            // 添加点击事件
            textDiv.addEventListener('click', (e) => {
              const words = item.str.split(/\s+/)
              if (words.length === 1) {
                const rect = textDiv.getBoundingClientRect()
                onWordClick(item.str.trim(), {
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                })
              } else {
                // 如果是多个单词，让用户点击具体位置
                const clickX = e.clientX - textDiv.getBoundingClientRect().left
                const charWidth = textDiv.offsetWidth / item.str.length
                const charIndex = Math.floor(clickX / charWidth)
                let wordStart = 0
                let currentPos = 0

                for (let i = 0; i < words.length; i++) {
                  const wordEnd = wordStart + words[i].length
                  if (charIndex >= currentPos && charIndex < currentPos + words[i].length) {
                    const rect = textDiv.getBoundingClientRect()
                    onWordClick(words[i].trim(), {
                      x: e.clientX,
                      y: rect.top,
                    })
                    break
                  }
                  currentPos += words[i].length + 1 // +1 for space
                  wordStart = wordEnd + 1
                }
              }
            })

            textLayerDiv.appendChild(textDiv)
          }
        })

        // 添加页码标签
        const pageLabel = document.createElement('div')
        pageLabel.className = 'pdf-page-label'
        pageLabel.textContent = `第 ${pageNum} / ${pdfDoc.numPages} 页`
        pageContainer.appendChild(pageLabel)

        containerRef.current?.appendChild(pageContainer)
      } catch (error) {
        console.error(`Error rendering page ${pageNum}:`, error)
      }
    }

    // 清空容器
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
    }
    canvasRefs.current.clear()
    textLayerRefs.current.clear()

    // 渲染所有页面
    const renderAllPages = async () => {
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        await renderPage(i)
      }
    }

    renderAllPages()
  }, [pdfDoc, scale, onWordClick])

  // 处理滚动
  const handleScroll = () => {
    if (!containerRef.current || !syncScrollEnabled) return

    setIsUserScrolling(true)

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
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
    if (!containerRef.current || isUserScrolling || !syncScrollEnabled) return

    const { scrollHeight, clientHeight } = containerRef.current
    const maxScroll = scrollHeight - clientHeight
    const targetScroll = rightScrollRatio * maxScroll

    containerRef.current.scrollTop = targetScroll
  }, [rightScrollRatio, isUserScrolling, syncScrollEnabled])

  // 缩放控制
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5))
  const handleZoomReset = () => setScale(1.5)

  if (loading) {
    return (
      <div className="pdf-loading">
        <div className="spinner"></div>
        <p>正在加载PDF文件...</p>
      </div>
    )
  }

  return (
    <div className="pdf-viewer-wrapper">
      <div className="pdf-controls">
        <div className="zoom-controls">
          <button onClick={handleZoomOut} className="zoom-btn" title="缩小">
            🔍-
          </button>
          <span className="zoom-level">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} className="zoom-btn" title="放大">
            🔍+
          </button>
          <button onClick={handleZoomReset} className="zoom-btn" title="重置">
            重置
          </button>
        </div>
        <div className="page-info">
          共 {numPages} 页
        </div>
      </div>
      <div
        ref={containerRef}
        className="pdf-container"
        onScroll={handleScroll}
      >
        {/* PDF页面将在这里渲染 */}
      </div>
    </div>
  )
}

export default PDFViewer
