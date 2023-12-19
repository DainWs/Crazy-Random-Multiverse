import SettingsApiProxy from "./SettingsApiProxy"

// TODO esto tal vez sea un Controller

async function getSettings() {
    return SettingsApiProxy.getSettings()
}

async function setUsername(username) {
    const appSettings = await SettingsApiProxy.getSettings()
    appSettings.username = username

    SettingsApiProxy.updateSettings(appSettings)
}

async function getUsername() {
    return (await getSettings()).username
}

export default {
    getSettings,
    setUsername,
    getUsername,
}