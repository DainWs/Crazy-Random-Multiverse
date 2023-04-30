import type { WindowSettings } from "./services/settings/models/AppSettings";

interface ElectronPreloadSettings {
    loadWindowConfiguration: (() => WindowSettings),
    saveWindowConfiguration: ((config: WindowSettings) => void)
}

declare var settings: ElectronPreloadSettings