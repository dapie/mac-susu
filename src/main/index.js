'use strict'
import { app, BrowserWindow, ipcMain } from 'electron'
import axios from 'axios'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 500,
    useContentSize: true,
    width: 400,
    titleBarStyle: 'hiddenInset',
    frame: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('auth', async (event, login, password) => {
  axios.post('https://susu-online.ru/api/v1/user/auth?login=' + login + '&password=' + password).then(function (response) {
    mainWindow.webContents.send('setToken', response.data.result.access_token)
  }).catch(function (error) {
    mainWindow.webContents.send('showError', error.response.data.error.message)
  })
})

ipcMain.on('authDevice', async (event) => {
  authDevice()
})

ipcMain.on('getFaculties', async (event) => {
  getFaculties()
})

ipcMain.on('getGroups', async (event, id) => {
  axios.get('https://susu-online.ru/api/v1/groups/' + id, {
  }).then(function (response) {
    mainWindow.webContents.send('setGroups', response.data.result)
  }).catch(function (error) {
    console.log(error.response.data)
  })
})

ipcMain.on('getSchedule', async (event, group) => {
  axios.get('https://susu-online.ru/api/v1/schedule/' + group.id, {
  }).then(function (response) {
    mainWindow.setContentSize(400, 700, true)
    var pos = mainWindow.getPosition()
    mainWindow.setPosition(pos[0], pos[1] - 100, true)
    mainWindow.webContents.send('setSchedule', response.data.result, group)
  }).catch(function (error) {
    console.log(error)
  })
})

ipcMain.on('setToken', async (event, token) => {
  setToken(token)
})

function setToken (token) {
  axios.defaults.headers.common['Authorization'] = token
}

function authDevice () {
  axios.post('https://susu-online.ru/api/v1/user/login?device_type=android&uuid=5825a957-3552-47c4-aa60-4dac869d586b&device_name=Test&app_version=4.2.7&os_version=7.1.1&').then(function (response) {
    console.log(response.data)
    mainWindow.webContents.send('setToken', response.data.result.access_token)
  }).catch(function (error) {
    console.log(error.response.data)
  })
}

function getFaculties () {
  axios.get('https://susu-online.ru/api/v1/faculties', {
  }).then(function (response) {
    mainWindow.webContents.send('setFaculties', response.data.result)
  }).catch(function (error) {
    console.log(error.response.data)
    if (error.response.data.error.code === 401) {
      authDevice()
      getFaculties()
    }
  })
}
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
