// 论文条目类型
export interface PaperEntry {
  id: string
  title: string
  filePath: string
  fileType: 'pdf' | 'text'
  summary: string
  notesPath: string // 关联的markdown笔记文件路径
  tags: string[]
  addedDate: Date
  lastModified: Date
}

// 思维导图节点类型
export interface MindMapNode {
  id: string
  type: 'topic' | 'paper' | 'note'
  label: string
  paperId?: string // 如果是论文节点，关联的论文ID
  summary?: string // 节点的summary
  position: { x: number; y: number }
  data?: any
}

// 思维导图连接线类型
export interface MindMapEdge {
  id: string
  source: string
  target: string
  label?: string
}

// 思维导图类型
export interface MindMap {
  id: string
  name: string
  nodes: MindMapNode[]
  edges: MindMapEdge[]
  createdDate: Date
  lastModified: Date
}

// 论文库类型
export interface PaperLibrary {
  papers: PaperEntry[]
  mindMaps: MindMap[]
  directories: string[] // 监控的目录列表
}

// 视图模式
export type ViewMode = 'mindmap' | 'reading' | 'notes-only' | 'library'

// 应用状态
export interface AppState {
  currentView: ViewMode
  selectedPaperId: string | null
  selectedMindMapId: string | null
  library: PaperLibrary
}
