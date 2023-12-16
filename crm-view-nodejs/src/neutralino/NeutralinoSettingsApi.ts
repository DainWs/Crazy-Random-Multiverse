import AppSettingsParser from "@/services/settings/models/AppSettingsParser"
import AppSettings from "@/services/settings/models/AppSettings"
import { storage } from "@neutralinojs/lib"

function updateSettings(settings: AppSettings): void {
    storage.setData('settings', AppSettingsParser.parseToJson(settings))
}

async function getSettings(): Promise<AppSettings> {
    return AppSettingsParser.parseToObject(await storage.getData('settings'))
}

export default {
    updateSettings,
    getSettings
}