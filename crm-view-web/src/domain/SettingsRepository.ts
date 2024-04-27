type SettingName = "username";
type SettingValue = string | undefined;

type Settings = {
    username: SettingValue
}

type MinimalSettings = {
    username: SettingValue
}

type SettingSection = {
    id: number,
    name: string
}

interface SettingsRepository {
    saveSettings(settings: Settings): void;
    findSettingByName(settingName: SettingName): SettingValue,
    findAllSettings(): Settings,
    findAllSettingSections(): Array<SettingSection>
}


export { SettingName, SettingValue, Settings, MinimalSettings, SettingSection };
export default SettingsRepository;