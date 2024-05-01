type SettingName = 'username';
type SettingValue = string | undefined;

class Setting {
  public name: SettingName;
  public value: SettingValue;

  public constructor(name: SettingName, value: SettingValue) {
    this.name = name;
    this.value = value;
  }
}

class Settings {
  public username: SettingValue;

  public constructor() {}

  public getSetting(settingName: SettingName): SettingValue {
    return this[settingName];
  }
}

type MinimalSettings = {
  username: SettingValue;
};

type SettingSectionName = 'general';

type SettingSection = {
  id: number;
  name: SettingSectionName;
};

interface SettingsRepository {
  saveSettings(settings: Settings): void;
  findSettingByName(settingName: SettingName): SettingValue;
  findAllSettings(): Settings;
  findAllSettingSections(): Array<SettingSection>;
}

export default SettingsRepository;
export {
  Settings,
  Setting,
  SettingName,
  SettingValue,
  MinimalSettings,
  SettingSection,
  SettingSectionName
};
