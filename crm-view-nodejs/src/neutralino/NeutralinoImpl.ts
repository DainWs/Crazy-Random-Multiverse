import { init, app, window, debug, filesystem, storage } from "@neutralinojs/lib"
import { defaultWindowSettings, stringifyFromWindowSettings, WindowSettings } from "@/services/settings/models/window/Window"
import { settingsApi } from "@/services/settings/SettingsApi"

async function checkDirectory(directory: string): Promise<void> {
    try { await filesystem.readDirectory(directory) }
    catch (e) {
        debug.log(`creating directory ${directory}`)
        await filesystem.createDirectory(directory)
    }
}

async function checkStorage() {
    const keyList: string[] = await storage.getKeys()

    if (!keyList.includes('window')) {
        settingsApi.setWindowConfiguration(defaultWindowSettings)
    }
}

async function checkWindow() {
    const windowSettings: WindowSettings = await settingsApi.getWindowConfiguration()

    if (windowSettings.screenMode.isMaximized) await window.maximize()
}


export async function initialize(): Promise<void> {
    await init()
    await checkDirectory('.storage')
    await checkStorage()
    await window.show()
    await checkWindow()
}