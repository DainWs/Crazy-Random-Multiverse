import eventObserver from "@/events/eventObserver";
import { updateUserInfo } from "@/repositories/api/v1";
import settingsRepository from "@/repositories/settingsRepository";

const getSettingSections = () => {
    return settingsRepository.findAllSettingSections();
}

const getSettings = () => {
    return settingsRepository.findAllSettings()
}

const getSetting = (settingName) => {
    return settingsRepository.findSettingByName(settingName);
}

/**
 * @param {Array.<{name: string, value: any}>} settings 
 */
const setSettings = (settings) => {
    updateUserInfoIfHasChange(settings);

    const currentSettings = settingsRepository.findAllSettings();
    applyChanges(currentSettings, settings);

    settingsRepository.saveSettings(currentSettings)
}

function applyChanges(currentSettings, newSettings) {
    newSettings.forEach(setting => {
        if (currentSettings[setting.name] !== undefined) {
            currentSettings[setting.name] = setting.value;
        }
    });
}

function updateUserInfoIfHasChange(settings) {
    const currentSettings = settingsRepository.findAllSettings();

    if (settings.username && settings.username !== currentSettings.username) {
        updateUserInfo({ username: settings.username });
    }
}

export {
    getSettingSections,
    setSettings,
    getSettings,
    getSetting
}