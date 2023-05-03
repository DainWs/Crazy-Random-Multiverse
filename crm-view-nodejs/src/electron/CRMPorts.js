const { contextBridge, ipcMain, ipcRenderer } = require('electron')

const SettingsAPI = {
  setGeneralConfiguration: (newSettings) => ipcRenderer.send('set/general-settings'),
  getGeneralConfiguration: () => ipcRenderer.invoke('get/general-settings')
}

const VersionAPI = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  checkForUpdates: () => ipcRenderer.send('check/updates')
}

contextBridge.exposeInMainWorld('settings', SettingsAPI)
contextBridge.exposeInMainWorld('versions', VersionAPI)