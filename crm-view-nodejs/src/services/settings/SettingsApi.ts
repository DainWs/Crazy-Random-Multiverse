import { storage } from "@neutralinojs/lib"
import { ProfileSettings } from "./models/AppSettings"
import { defaultProfileSettings, profileSettingsParser } from "./models/ProfileSettings"
import { WindowSettings, defaultWindowSettings, windowSettingsParser } from "./models/WindowSettings"

interface SettingsAPI {
    setWindowConfiguration(newSettings: WindowSettings): void
    getWindowConfiguration(): Promise<WindowSettings>

    setProfileConfiguration(newSettings: ProfileSettings): void
    getProfileConfiguration(): Promise<ProfileSettings>
}

class SimulateSettingsAPI implements SettingsAPI {
    private windowSettings: WindowSettings
    private profileSettings: ProfileSettings

    public constructor() {
        this.windowSettings = defaultWindowSettings
        this.profileSettings = defaultProfileSettings
    }

    public setWindowConfiguration(newSettings: WindowSettings): void {
        this.windowSettings = newSettings
    }

    public async getWindowConfiguration(): Promise<WindowSettings> {
        return this.windowSettings
    }

    public setProfileConfiguration(newSettings: ProfileSettings): void {
        this.profileSettings = newSettings
    }

    public async getProfileConfiguration(): Promise<ProfileSettings> {
        return this.profileSettings
    }
}

class RealSettingsAPI implements SettingsAPI {
    public setWindowConfiguration(newSettings: WindowSettings): void {
        storage.setData('window', windowSettingsParser.parseToJson(newSettings))
    }

    public async getWindowConfiguration(): Promise<WindowSettings> {
        return windowSettingsParser.parseToObject(await storage.getData('window'))
    }

    public setProfileConfiguration(newSettings: ProfileSettings): void {
        storage.setData('profile', profileSettingsParser.parseToJson(newSettings))
    }

    public async getProfileConfiguration(): Promise<ProfileSettings> {
        return profileSettingsParser.parseToObject(await storage.getData('profile'))
    }
}

function getSettingsApi(): SettingsAPI {
    try {
        return new RealSettingsAPI()
    } catch (e) {
        return new SimulateSettingsAPI()
    }
}

const INSTANCE: SettingsAPI = getSettingsApi()
export { INSTANCE as settingsApi }