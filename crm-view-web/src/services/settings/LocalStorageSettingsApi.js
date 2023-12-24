import AppSettingsParser from "./AppSettingsParser";

function updateSettings(settings) {
    let jsonSettings = AppSettingsParser.parseToJson(settings);
    localStorage.setItem("settings", jsonSettings);
}

async function getSettings() {
    let jsonSettings = localStorage.getItem("settings");
    console.log(jsonSettings)
    return AppSettingsParser.parseToObject(jsonSettings);
}

export default {
    updateSettings,
    getSettings
};