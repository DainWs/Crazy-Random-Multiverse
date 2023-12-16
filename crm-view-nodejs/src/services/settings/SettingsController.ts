import AppSettings from "./models/AppSettings"
import GeneralSettings from "./models/GeneralSettings"
import SettingsApiProxy from "./SettingsApiProxy"

async function getSettings(): Promise<AppSettings> {
    return SettingsApiProxy.getSettings()
}

async function setUsername(username: string): Promise<void> {
    const appSettings: AppSettings = await SettingsApiProxy.getSettings()
    appSettings.username = username

    SettingsApiProxy.updateSettings(appSettings)
}

async function getUsername(): Promise<string> {
    return (await getSettings()).username
}

async function setGeneral(newGeneralSettings: GeneralSettings): Promise<void> {
    const appSettings: AppSettings = await SettingsApiProxy.getSettings()
    appSettings.general = newGeneralSettings

    SettingsApiProxy.updateSettings(appSettings)
}

async function getGeneral(): Promise<GeneralSettings> {
    return (await getSettings()).general
}

export default {
    getSettings,
    setUsername,
    getUsername,
    setGeneral,
    getGeneral
}