import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { readdirSync, existsSync, statSync, readFileSync, writeFileSync, unlinkSync, mkdirSync } from 'fs'
import { homedir } from 'os'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'AI Skill Manager',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// ==================== IPC — Skill File Operations ====================

function resolvePath(p: string): string {
  if (p.startsWith('~/')) return join(homedir(), p.slice(2))
  return p
}

ipcMain.handle('scan:directory', async (_event, dirPath: string) => {
  const results: { name: string; path: string; scope: string }[] = []
  const fullPath = resolvePath(dirPath)
  if (!existsSync(fullPath)) return results

  const entries = readdirSync(fullPath, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const skillDir = join(fullPath, entry.name)
      const skillFile = join(skillDir, 'SKILL.md')
      if (existsSync(skillFile)) {
        results.push({
          name: entry.name,
          path: skillFile,
          scope: dirPath.includes('.reasonix') || dirPath.includes('.claude') ? 'global' : 'project',
        })
      }
    }
  }
  return results
})

ipcMain.handle('file:read', async (_event, filePath: string) => {
  const fullPath = resolvePath(filePath)
  if (!existsSync(fullPath)) return null
  return readFileSync(fullPath, 'utf-8')
})

ipcMain.handle('file:write', async (_event, filePath: string, content: string) => {
  const fullPath = resolvePath(filePath)
  const dir = fullPath.substring(0, fullPath.lastIndexOf('/'))
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(fullPath, content, 'utf-8')
  return true
})

ipcMain.handle('file:delete', async (_event, filePath: string) => {
  const fullPath = resolvePath(filePath)
  if (existsSync(fullPath)) {
    unlinkSync(fullPath)
    // Also try to remove parent dir if empty
    const dir = fullPath.substring(0, fullPath.lastIndexOf('/'))
    try {
      const remaining = readdirSync(dir)
      if (remaining.length === 0) {
        // Remove empty directory (rmdirSync or rimraf)
        const { rmdirSync } = require('fs')
        rmdirSync(dir)
      }
    } catch {}
    return true
  }
  return false
})

ipcMain.handle('app:getVersion', () => {
  return app.getVersion()
})
