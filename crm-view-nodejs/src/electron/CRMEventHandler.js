const { ipcMain } = require('electron')
const SettingsStorage = require('./CRMStorage')

ipcMain.on('set/general-settings', async (event, newSettings) => {
    SettingsStorage.saveWindowConfiguration(newSettings)
})

ipcMain.handle('get/general-settings', async (event, args) => {
    return SettingsStorage.loadWindowConfiguration()
})