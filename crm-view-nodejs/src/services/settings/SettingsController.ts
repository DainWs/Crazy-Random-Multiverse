import { GeneralSettings } from "./models/AppSettings"
import { WindowSettings } from "./models/window/Window";
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