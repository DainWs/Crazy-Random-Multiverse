import { AppSettings, GeneralSettings } from "./models/AppSettings"

class SettingsController {
    private appSettings: AppSettings

    constructor() {
        this.appSettings = {
            general: {
                window: settings.loadWindowConfiguration() 
            }
        }
    }

    public getGeneralConfiguration(): GeneralSettings {
        return this.appSettings.general;
    }
}

console.log(settings);
console.log(window);
const INSTANCE: SettingsController = new SettingsController()
export { INSTANCE as settingsController }