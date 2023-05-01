const { ipcMain } = require('electron')
const SettingsStorage = require('./CRMStorage')

ipcMain.on('set/window-settings', async (event, newSettings) => {
    SettingsStorage.saveWindowConfiguration(newSettings)
})

ipcMain.handle('get/window-settings', async (event, args) => {
    return SettingsStorage.loadWindowConfiguration()
})