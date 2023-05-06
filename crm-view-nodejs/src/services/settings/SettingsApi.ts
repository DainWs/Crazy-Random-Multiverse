import { defaultResolution } from "./models/window/WindowResolution"
import { defaultScreenMode } from "./models/window/WindowScreenMode"
import { storage } from "@neutralinojs/lib"
import { defaultWindowSettings, parseToWindowSettings, stringifyFromWindowSettings, WindowSettings } from "./models/window/Window"

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
    public setWindowConfiguration(newSettings: WindowSettings): void {
        storage.setData('window', stringifyFromWindowSettings(newSettings))
    }

    public async getWindowConfiguration(): Promise<WindowSettings> {
        return parseToWindowSettings(await storage.getData('window'))
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