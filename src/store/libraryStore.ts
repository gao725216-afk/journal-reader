import { create } from 'zustand'
import { PaperEntry, MindMap, PaperLibrary, ViewMode } from '../types/library'

interface LibraryState {
  // 论文库
  papers: PaperEntry[]
  mindMaps: MindMap[]
  directories: string[]

  // 当前视图
  currentView: ViewMode
  setCurrentView: (view: ViewMode) => void

  // 选中的论文和思维导图
  selectedPaperId: string | null
  selectedMindMapId: string | null
  setSelectedPaper: (id: string | null) => void
  setSelectedMindMap: (id: string | null) => void

  // 论文操作
  addPaper: (paper: PaperEntry) => void
  updatePaper: (id: string, updates: Partial<PaperEntry>) => void
  deletePaper: (id: string) => void
  getPaper: (id: string) => PaperEntry | undefined

  // 思维导图操作
  addMindMap: (mindMap: MindMap) => void
  updateMindMap: (id: string, updates: Partial<MindMap>) => void
  deleteMindMap: (id: string) => void
  getMindMap: (id: string) => MindMap | undefined

  // 目录操作
  addDirectory: (path: string) => void
  removeDirectory: (path: string) => void

  // 持久化操作
  saveLibrary: () => Promise<void>
  loadLibrary: () => Promise<void>
}

// 检查是否在Electron环境中
const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  // 初始状态
  papers: [],
  mindMaps: [],
  directories: [],
  currentView: 'library',
  selectedPaperId: null,
  selectedMindMapId: null,

  // 视图操作
  setCurrentView: (view) => set({ currentView: view }),
  setSelectedPaper: (id) => set({ selectedPaperId: id }),
  setSelectedMindMap: (id) => set({ selectedMindMapId: id }),

  // 论文操作
  addPaper: (paper) =>
    set((state) => ({
      papers: [...state.papers, paper],
    })),

  updatePaper: (id, updates) =>
    set((state) => ({
      papers: state.papers.map((p) =>
        p.id === id ? { ...p, ...updates, lastModified: new Date() } : p
      ),
    })),

  deletePaper: (id) =>
    set((state) => ({
      papers: state.papers.filter((p) => p.id !== id),
    })),

  getPaper: (id) => {
    const state = get()
    return state.papers.find((p) => p.id === id)
  },

  // 思维导图操作
  addMindMap: (mindMap) =>
    set((state) => ({
      mindMaps: [...state.mindMaps, mindMap],
    })),

  updateMindMap: (id, updates) =>
    set((state) => ({
      mindMaps: state.mindMaps.map((m) =>
        m.id === id ? { ...m, ...updates, lastModified: new Date() } : m
      ),
    })),

  deleteMindMap: (id) =>
    set((state) => ({
      mindMaps: state.mindMaps.filter((m) => m.id !== id),
    })),

  getMindMap: (id) => {
    const state = get()
    return state.mindMaps.find((m) => m.id === id)
  },

  // 目录操作
  addDirectory: (path) =>
    set((state) => ({
      directories: [...state.directories, path],
    })),

  removeDirectory: (path) =>
    set((state) => ({
      directories: state.directories.filter((d) => d !== path),
    })),

  // 持久化操作
  saveLibrary: async () => {
    if (!isElectron()) {
      console.warn('Not in Electron environment, skipping save')
      return
    }

    const state = get()
    const libraryData: PaperLibrary = {
      papers: state.papers,
      mindMaps: state.mindMaps,
      directories: state.directories,
    }

    try {
      const result = await window.electronAPI.saveLibraryData(
        JSON.stringify(libraryData, null, 2)
      )
      if (result.success) {
        console.log('Library saved successfully')
      } else {
        console.error('Failed to save library:', result.error)
      }
    } catch (error) {
      console.error('Error saving library:', error)
    }
  },

  loadLibrary: async () => {
    if (!isElectron()) {
      console.warn('Not in Electron environment, skipping load')
      return
    }

    try {
      const result = await window.electronAPI.loadLibraryData()
      if (result.success && result.data) {
        const libraryData: PaperLibrary = JSON.parse(result.data)
        set({
          papers: libraryData.papers || [],
          mindMaps: libraryData.mindMaps || [],
          directories: libraryData.directories || [],
        })
        console.log('Library loaded successfully')
      }
    } catch (error) {
      console.error('Error loading library:', error)
    }
  },
}))
