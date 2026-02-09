import { app, BrowserWindow, shell, utilityProcess, Menu } from 'electron'

import path from 'node:path'
import waitOn from 'wait-on'
import getPort from 'get-port'
import { spawn } from 'node:child_process'
import dotenv from 'dotenv'

let nuxtProcess
let nuxtServerPath

dotenv.config({ path: path.join(process.resourcesPath, 'app', '.env') })
const buildMode = process.env.BUILD_MODE

async function createWindow(port) {
  Menu.setApplicationMenu(null)

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#ffffff',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (app.isPackaged) {
    if (buildMode === 'node-server') {
      win.loadFile(path.join(process.resourcesPath, 'app', 'electron', 'loader.html'))

      nuxtServerPath = path.join(process.resourcesPath, 'app', '.output', 'server', 'index.mjs')
      nuxtProcess = utilityProcess.fork(nuxtServerPath, [], {
        windowsHide: true,
        env: {
          ...process.env,
          PORT: `${port}`
        }
      })

      await waitOn({ resources: [`http://localhost:${port}`] })
      await win.loadURL(`http://localhost:${port}`)
    }
  } else {
    win.webContents.openDevTools({ mode: 'detach' })
    win.loadFile(path.join(process.cwd(), 'electron', 'loader.html'))

    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    nuxtProcess = spawn(cmd, ['run', 'dev'], {
      cwd: path.resolve(process.cwd()),
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, PORT: String(port) }
    })

    nuxtProcess.stdout.setEncoding('utf8')
    nuxtProcess.stdout.on('data', data => console.log(data))
    nuxtProcess.stderr.on('data', data => console.error(data))

    await waitOn({ resources: [`http://localhost:${port}`] })
    await win.loadURL(`http://localhost:${port}`)
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })

  win.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('http')) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })

  win.on('closed', () => {
    if (nuxtProcess) nuxtProcess.kill()
    nuxtProcess = null
  })
}

app.on('ready', async () => {
  const port = await getPort()
  await createWindow(port)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  nuxtProcess?.kill()
})
