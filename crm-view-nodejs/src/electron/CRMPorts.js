const { contextBridge, ipcMain, ipcRenderer } = require('electron')

const SettingsAPI = {
  setWindowConfiguration: (newSettings) => ipcRenderer.send('set/window-settings'),
  getWindowConfiguration: () => ipcRenderer.invoke('get/window-settings')
}

const VersionAPI = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  checkForUpdates: () => ipcRenderer.send('check/updates')
}

contextBridge.exposeInMainWorld('settings', SettingsAPI)
contextBridge.exposeInMainWorld("versions", VersionAPI)