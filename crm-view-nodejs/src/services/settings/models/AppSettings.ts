import { WindowSettings } from "./WindowSettings"

export interface GeneralSettings {
    window: WindowSettings
}

export interface ProfileSettings {
    username: String
}

export interface AppSettings {
    general: GeneralSettings
    profile: ProfileSettings
}
