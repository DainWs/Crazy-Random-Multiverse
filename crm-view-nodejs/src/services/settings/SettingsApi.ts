import AppSettings from "./models/AppSettings"

export default interface SettingsApi {
    updateSettings(settings: AppSettings): void
    getSettings(): Promise<AppSettings>
}
