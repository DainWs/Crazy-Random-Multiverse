import { GeneralSettings, WindowSettings } from "./models/AppSettings"
import { settingsApi } from "./SettingsApi";

class SettingsController {
    public setGeneralConfiguration(newSettings: WindowSettings): void {
        settingsApi.setWindowConfiguration(newSettings)
    }

    public async getGeneralConfiguration(): Promise<GeneralSettings> {
        return { window: await settingsApi.getWindowConfiguration() }
    }
}

const INSTANCE: SettingsController = new SettingsController()
export { INSTANCE as settingsController }