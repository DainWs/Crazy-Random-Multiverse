import { AppSettings, GeneralSettings } from "./models/AppSettings"

class SettingsController {
    private appSettings: AppSettings

    constructor(settingsStorage) {

    }

    public getGeneralConfiguration(): GeneralSettings {
        return this.appSettings.general;
    }
}

console.log(settings);
console.log(window);
const INSTANCE: SettingsController = new SettingsController(settings)
export { INSTANCE as settingsController }