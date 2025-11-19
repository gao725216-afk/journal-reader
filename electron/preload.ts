import { contextBridge, ipcRenderer } from 'electron'

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 文件系统操作
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  selectPdfFile: () => ipcRenderer.invoke('select-pdf-file'),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  readTextFile: (filePath: string) => ipcRenderer.invoke('read-text-file', filePath),
  writeFile: (filePath: string, content: string) =>
    ipcRenderer.invoke('write-file', filePath, content),
  scanDirectory: (dirPath: string) => ipcRenderer.invoke('scan-directory', dirPath),
  fileExists: (filePath: string) => ipcRenderer.invoke('file-exists', filePath),
  getFileStats: (filePath: string) => ipcRenderer.invoke('get-file-stats', filePath),

  // 库数据操作
  saveLibraryData: (data: string) => ipcRenderer.invoke('save-library-data', data),
  loadLibraryData: () => ipcRenderer.invoke('load-library-data'),
})

// TypeScript类型定义
declare global {
  interface Window {
    electronAPI: {
      selectDirectory: () => Promise<string | null>
      selectPdfFile: () => Promise<string | null>
      readFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string; path?: string }>
      readTextFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string; path?: string }>
      writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>
      scanDirectory: (dirPath: string) => Promise<{ success: boolean; files?: any[]; error?: string }>
      fileExists: (filePath: string) => Promise<boolean>
      getFileStats: (filePath: string) => Promise<{ success: boolean; stats?: any; error?: string }>
      saveLibraryData: (data: string) => Promise<{ success: boolean; path?: string; error?: string }>
      loadLibraryData: () => Promise<{ success: boolean; data?: string; error?: string }>
    }
  }
}
