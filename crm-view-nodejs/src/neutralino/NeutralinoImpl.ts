import { init, app, window, debug, filesystem, storage } from "@neutralinojs/lib"
import { defaultWindowSettings, WindowSettings } from "@/services/settings/models/WindowSettings"
import { settingsApi } from "@/services/settings/SettingsApi"
import { defaultProfileSettings } from "@/services/settings/models/ProfileSettings"

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

    if (!keyList.includes('profile')) {
        settingsApi.setProfileConfiguration(defaultProfileSettings)
    }
}

async function checkWindow() {
    const windowSettings: WindowSettings = await settingsApi.getWindowConfiguration()

    if (windowSettings.displayMode.isFullScreen) await window.setFullScreen()
}


export async function initialize(): Promise<void> {
    try {
        await init()
        await checkDirectory('.storage')
        await checkStorage()
        await checkWindow()
        await window.show()
    } catch(e) {
        console.log()
    }
}