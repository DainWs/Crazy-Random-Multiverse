import { GeneralSettings, ProfileSettings } from "./models/AppSettings"
import { WindowSettings } from "./models/WindowSettings";
import { settingsApi } from "./SettingsApi";

class SettingsController {
    public setGeneralConfiguration(newSettings: GeneralSettings): void {
        settingsApi.setWindowConfiguration(newSettings.window)
    }

    public async getGeneralConfiguration(): Promise<GeneralSettings> {
        return { window: await settingsApi.getWindowConfiguration() }
    }

    public setProfileConfiguration(newSettings: ProfileSettings): void {
        settingsApi.setProfileConfiguration(newSettings)
    }

    public async getProfileConfiguration(): Promise<ProfileSettings> {
        return await settingsApi.getProfileConfiguration()
    }
}

const INSTANCE: SettingsController = new SettingsController()
export { INSTANCE as settingsController }