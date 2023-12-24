const simulatedAppSettings = {
    username: `user_${new Date().getTime()}`,
}

const properties = { realSettingsApi: null }

function setRealSettingsApi(settingsApi) {
    properties.realSettingsApi = settingsApi
}

function updateSettings(settings) {
    if (properties.realSettingsApi) {
        properties.realSettingsApi.updateSettings(settings);
    } else {
        updateSimulatedSettings(settings);
    }
}

function updateSimulatedSettings(settings) {
    simulatedAppSettings.username = settings.username;
}

async function getSettings() {
    if (properties.realSettingsApi) {
        return properties.realSettingsApi.getSettings();
    }

    return simulatedAppSettings;
}

export default {
    setRealSettingsApi,
    updateSettings,
    getSettings
};