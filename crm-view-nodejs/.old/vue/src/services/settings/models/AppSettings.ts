import { WindowResolution } from "./window/WindowResolution"
import { ScreenMode } from "./window/WindowScreenMode"

export interface WindowSettings {
    resolution: WindowResolution
    screenMode: ScreenMode
    darkTheme: boolean
}

export interface GeneralSettings {
    window: WindowSettings
}

export interface AppSettings {
    general: GeneralSettings
}
