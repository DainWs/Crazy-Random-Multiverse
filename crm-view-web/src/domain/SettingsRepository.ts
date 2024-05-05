import Settings, { SettingName, SettingValue } from '@/domain/settings/Settings';

interface SettingsRepository {
  saveSettings(settings: Settings): void;
  findSettingByName(settingName: SettingName): SettingValue;
  findAllSettings(): Settings;
}

export default SettingsRepository;
