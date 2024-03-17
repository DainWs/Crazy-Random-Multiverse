import SettingsApiProxy from "./SettingsApiProxy"

const getSettings = () => {
    return SettingsApiProxy.getSettings()
}

const setUsername = (username) => {
    const appSettings = SettingsApiProxy.getSettings()
    appSettings.username = username

    SettingsApiProxy.updateSettings(appSettings)
}

const getUsername = () => {
    return getSettings().username
}

export default {
    getSettings,
    setUsername,
    getUsername,
}