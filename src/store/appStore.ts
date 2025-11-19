import { create } from 'zustand'

interface WordPosition {
  x: number
  y: number
}

interface WordDefinition {
  word: string
  chinese: string
  english: string
  phonetic?: string
}

interface AppState {
  // 论文内容
  paperContent: string
  setPaperContent: (content: string) => void

  // Markdown笔记内容
  markdownContent: string
  setMarkdownContent: (content: string) => void

  // 选中的单词
  selectedWord: string | null
  wordPosition: WordPosition | null
  wordDefinition: WordDefinition | null
  setSelectedWord: (word: string | null, position: WordPosition | null) => void
  setWordDefinition: (definition: WordDefinition | null) => void

  // 滚动同步
  leftScrollRatio: number
  rightScrollRatio: number
  setLeftScrollRatio: (ratio: number) => void
  setRightScrollRatio: (ratio: number) => void
  syncScrollEnabled: boolean
  toggleSyncScroll: () => void

  // 插入单词到笔记
  insertWordToNotes: (definition: WordDefinition) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  paperContent: '',
  setPaperContent: (content) => set({ paperContent: content }),

  markdownContent: '# 论文笔记\n\n',
  setMarkdownContent: (content) => set({ markdownContent: content }),

  selectedWord: null,
  wordPosition: null,
  wordDefinition: null,
  setSelectedWord: (word, position) =>
    set({ selectedWord: word, wordPosition: position }),
  setWordDefinition: (definition) =>
    set({ wordDefinition: definition }),

  leftScrollRatio: 0,
  rightScrollRatio: 0,
  setLeftScrollRatio: (ratio) => set({ leftScrollRatio: ratio }),
  setRightScrollRatio: (ratio) => set({ rightScrollRatio: ratio }),
  syncScrollEnabled: true,
  toggleSyncScroll: () =>
    set((state) => ({ syncScrollEnabled: !state.syncScrollEnabled })),

  insertWordToNotes: (definition) => {
    const { markdownContent } = get()
    const wordNote = `\n**${definition.word}** ${definition.phonetic ? `_${definition.phonetic}_` : ''}\n- 中文: ${definition.chinese}\n- English: ${definition.english}\n\n`
    set({ markdownContent: markdownContent + wordNote })
  },
}))
