import SettingsApi from "./SettingsApi";
import AppSettings from "./models/AppSettings";
import { findByName as findResolutionByName } from "./models/WindowResolution"
import { findByName as findDisplayModeByName } from "./models/WindowDisplayMode"

const simulatedAppSettings : AppSettings = {
    username: `user_${new Date().getTime()}`,
    general: {
        resolution: findResolutionByName("default"),
        displayMode: findDisplayModeByName("default"),
    }
}

class SettingsApiProxy implements SettingsApi {
    private realSettingsApi: SettingsApi | null

    public constructor() {
        this.realSettingsApi = null;
    }

    public setRealSettingsApi(settingsApi: SettingsApi): void {
        this.realSettingsApi = settingsApi
    }

    public updateSettings(settings: AppSettings): void {
        if (this.realSettingsApi) {
            this.realSettingsApi.updateSettings(settings);
        } else {
            this.updateSimulatedSettings(settings);
        }
    }

    private updateSimulatedSettings(settings: AppSettings) {
        simulatedAppSettings.username = settings.username;
        simulatedAppSettings.general.resolution = settings.general.resolution;
        simulatedAppSettings.general.displayMode = settings.general.displayMode;
    }

    public async getSettings(): Promise<AppSettings> {
        if (this.realSettingsApi) {
            return this.realSettingsApi.getSettings();
        }

        return simulatedAppSettings;
    }
}

const proxy : SettingsApiProxy = new SettingsApiProxy();
export default proxy;