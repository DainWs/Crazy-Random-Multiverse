/**
 * A set of all application settings
 * @typedef Settings
 * @property {string} username
 */

/**
 * @param {Settings} settings a set of all settings
 */
const saveSettings = (settings) => {
    let jsonSettings = parseToJson(settings);
    localStorage.setItem("settings", jsonSettings);
}

function parseToJson(appSettings) {
    const minimalSettings = {
        username: appSettings.username,
    }

    return JSON.stringify(minimalSettings);
}

/**
 * @returns {Settings} a set of all settings
 */
const findAllSettings = () => {
    let jsonSettings = localStorage.getItem("settings");
    return parseToObject(jsonSettings);
}

function parseToObject(stringObject) {
    const object = JSON.parse(stringObject)
    return {
        username: object?.username ?? `user_${new Date().getTime()}`,
    }
}

const findSettingByName = (settingName) => {
    return findAllSettings()[settingName] ?? undefined;
}

/**
 * @typedef SettingSection
 * @property {number} id
 * @property {string} name
 */

/**
 * @returns {Array.<SettingSection>}
 */
const findAllSettingSections = () => {
    const settingSections = new Array();
    settingSections.push({ id: 1, name: 'General' });
    return settingSections;
}

export default {
    saveSettings,
    findSettingByName,
    findAllSettings,
    findAllSettingSections
};