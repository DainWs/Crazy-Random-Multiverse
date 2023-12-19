const simulatedAppSettings = {
    username: `user_${new Date().getTime()}`,
}

let realSettingsApi = null;

function setRealSettingsApi(settingsApi) {
    realSettingsApi = settingsApi
}

function updateSettings(settings) {
    if (realSettingsApi) {
        realSettingsApi.updateSettings(settings);
    } else {
        updateSimulatedSettings(settings);
    }
}

function updateSimulatedSettings(settings) {
    simulatedAppSettings.username = settings.username;
}

async function getSettings() {
    if (realSettingsApi) {
        return realSettingsApi.getSettings();
    }

    return simulatedAppSettings;
}

export default {
    setRealSettingsApi,
    updateSettings,
    getSettings
};