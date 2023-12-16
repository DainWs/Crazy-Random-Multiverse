import { window, filesystem, storage, init } from "@neutralinojs/lib"
import AppSettings from "@/services/settings/models/AppSettings"
import SettingsApiProxy from "@/services/settings/SettingsApiProxy"
import NeutralinoSettingsApi from "@/neutralino/NeutralinoSettingsApi"

async function createDirectoryIfNotExist(directory: string): Promise<void> {
    try { await filesystem.readDirectory(directory) }
    catch (e) {
        await filesystem.createDirectory(directory)
    }
}

async function configureSettings() {
    const defaultAppSettings : AppSettings = await SettingsApiProxy.getSettings();
    SettingsApiProxy.setRealSettingsApi(NeutralinoSettingsApi)

    await createDirectoryIfNotExist(".storage")
    const keyList: string[] = await storage.getKeys()
    if (!keyList.includes('settings')) {
        SettingsApiProxy.updateSettings(defaultAppSettings)
    }
}

async function configureWindow() {
    const appSettings: AppSettings = await SettingsApiProxy.getSettings()

    if (appSettings.general.displayMode.isFullScreen) {
        await window.setFullScreen()
    }

    await window.show()
}

async function configure() {
    try {
        await init()
        await configureSettings()
        await configureWindow()
    } catch(e) {
        console.log()
    }
}

export default {
    configure
}