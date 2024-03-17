import localStorageSettingsApi from "@/services/settings/LocalStorageSettingsApi";
import settingsApiProxy from "@/services/settings/SettingsApiProxy";

const configureStorage = () => {
    settingsApiProxy.setRealSettingsApi(localStorageSettingsApi)
}

export { configureStorage }