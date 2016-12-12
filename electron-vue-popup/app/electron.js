'use strict'

const electron = require('electron')
const path = require('path')
const { app, ipcMain } = electron
const BrowserWindow = electron.BrowserWindow
const _ = require('lodash')

let mainWindow
let popupWindows = []
let config = {}

if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.url = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.url = `file://${__dirname}/dist/index.html`
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800
  })

  mainWindow.loadURL(config.url)

  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

    let installExtension = require('electron-devtools-installer')

    installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .then((name) => mainWindow.webContents.openDevTools())
      .catch((err) => console.log('An error occurred: ', err))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  console.log('mainWindow opened')
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

// IPC 관련
ipcMain.on('open-new-popup', function (event, args) {
  if(mainWindow === null) {
    createWindow()
  }
  const newPopup = new BrowserWindow({
    width: 400,
    height: 400,
    show: true
  })
  newPopup.chatId = args.id
  newPopup.loadURL(`file://${__dirname}/src/popup/popup.html?chatId=${newPopup.chatId}`)
  newPopup.on('closed', () => {
    console.log('closed')
    console.log(newPopup);
  })

  newPopup.on('show', () => {
    console.log('show')
  })

  popupWindows.push(newPopup)
})

ipcMain.on('request-all-popups', function (event, args) {
  event.sender.send('response-all-popups', popupWindows)
})
ipcMain.on('show-all-popups', function (event, args) {
  popupWindows.map((popup) => {
    popup.showInactive()
  })
})
ipcMain.on('hide-all-popups', function (event, args) {
  popupWindows.map((popup) => {
    popup.hide()
  })
})
ipcMain.on('close-all-popups', function (event, args) {
  for(let popup of popupWindows) {
    popup.close()
  }
  popupWindows = []
})
