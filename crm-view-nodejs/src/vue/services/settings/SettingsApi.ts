import { AppSettings, WindowSettings } from "./models/AppSettings"
import { defaultResolution } from "./models/window/WindowResolution"
import { defaultScreenMode } from "./models/window/WindowScreenMode"

interface SettingsAPI {
    setWindowConfiguration(newSettings: WindowSettings): void
    getWindowConfiguration(): Promise<WindowSettings>
}

class SimulateSettingsAPI implements SettingsAPI {
    private windowSettings: WindowSettings

    public constructor() {
        this.windowSettings = {
            resolution: defaultResolution,
            screenMode: defaultScreenMode,
            darkTheme: false
        }
    }

    public setWindowConfiguration(newSettings: WindowSettings): void {
        this.windowSettings = newSettings
    }

    public async getWindowConfiguration(): Promise<WindowSettings> {
        return this.windowSettings
    }
}

class RealSettingsAPI implements SettingsAPI {
    private checkAccess(): void {
        if (typeof settings === 'undefined') {
            throw new Error('Settings is undefined')
        }
    }

    public setWindowConfiguration(newSettings: WindowSettings): void {
        this.checkAccess()
        settings.setWindowConfiguration(newSettings)
    }

    public async getWindowConfiguration(): Promise<WindowSettings> {
        this.checkAccess()

        return await settings.getWindowConfiguration()
    }
}

function getSettingsApi(): SettingsAPI {    
    if (typeof settings === 'undefined') {
        console.warn('Settings API simulation was enabled')
        return new SimulateSettingsAPI()
    }
    return new RealSettingsAPI()
}

const INSTANCE: SettingsAPI = getSettingsApi()
export { INSTANCE as settingsApi }