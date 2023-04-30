const electron = require('electron')

var contextBridge = electron.contextBridge
contextBridge.exposeInMainWorld('settings', {
    loadWindowConfiguration: () => {},
    saveWindowConfiguration: (config) => {}
})
contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  checkForUpdates: () => {}
})