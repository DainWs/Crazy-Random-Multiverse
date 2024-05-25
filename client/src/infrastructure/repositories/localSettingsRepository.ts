import Settings, { SettingName, SettingValue } from '@/domain/settings/Settings';

const saveSettings = (settings: Settings): void => {
  const stringSettings = parseToString(settings);
  localStorage.setItem('settings', stringSettings);
};

function parseToString(settings: Settings): string {
  return btoa(btoa(JSON.stringify(settings)));
}

const findSettingByName = (settingName: SettingName): SettingValue => {
  return findAllSettings().getSettingValue(settingName);
};

const findAllSettings = (): Settings => {
  const jsonSettings = localStorage.getItem('settings');
  if (!jsonSettings) {
    const newSettings = new Settings();
    saveSettings(newSettings);
    return newSettings;
  }

  return parseToObject(jsonSettings);
};

function parseToObject(stringObject: string): Settings {
  const settings = new Settings();

  const dto = JSON.parse(atob(atob(stringObject)));
  for (const key in dto) {
    settings.setSettingValue((key as SettingName), dto[key]);
  }

  return settings;
}

export default {
  saveSettings,
  findSettingByName,
  findAllSettings
};
