import { WindowSettings } from "./window/Window"

export interface GeneralSettings {
    window: WindowSettings
}

export interface AppSettings {
    general: GeneralSettings
}
