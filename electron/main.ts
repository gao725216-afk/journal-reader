import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'

let mainWindow: BrowserWindow | null = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../build/icon.ico'),
  })

  // 在开发环境中加载Vite开发服务器
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC处理程序

// 选择文件夹
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

// 选择PDF文件
ipcMain.handle('select-pdf-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] },
      { name: 'Text Files', extensions: ['txt'] },
    ],
  })
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

// 读取文件
ipcMain.handle('read-file', async (event, filePath: string) => {
  try {
    const data = fs.readFileSync(filePath)
    return { success: true, data: data.toString('base64'), path: filePath }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// 读取文本文件
ipcMain.handle('read-text-file', async (event, filePath: string) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    return { success: true, data, path: filePath }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// 写入文件
ipcMain.handle('write-file', async (event, filePath: string, content: string) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// 扫描目录中的PDF文件
ipcMain.handle('scan-directory', async (event, dirPath: string) => {
  try {
    const files = fs.readdirSync(dirPath)
    const pdfFiles = files
      .filter((file) => file.toLowerCase().endsWith('.pdf') || file.toLowerCase().endsWith('.txt'))
      .map((file) => ({
        name: file,
        path: path.join(dirPath, file),
        type: file.toLowerCase().endsWith('.pdf') ? 'pdf' : 'text',
      }))
    return { success: true, files: pdfFiles }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// 检查文件是否存在
ipcMain.handle('file-exists', async (event, filePath: string) => {
  return fs.existsSync(filePath)
})

// 获取文件统计信息
ipcMain.handle('get-file-stats', async (event, filePath: string) => {
  try {
    const stats = fs.statSync(filePath)
    return {
      success: true,
      stats: {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
      },
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// 保存库数据
ipcMain.handle('save-library-data', async (event, data: string) => {
  try {
    const userDataPath = app.getPath('userData')
    const libraryPath = path.join(userDataPath, 'library.json')
    fs.writeFileSync(libraryPath, data, 'utf-8')
    return { success: true, path: libraryPath }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// 加载库数据
ipcMain.handle('load-library-data', async () => {
  try {
    const userDataPath = app.getPath('userData')
    const libraryPath = path.join(userDataPath, 'library.json')
    if (fs.existsSync(libraryPath)) {
      const data = fs.readFileSync(libraryPath, 'utf-8')
      return { success: true, data }
    }
    return { success: true, data: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})
