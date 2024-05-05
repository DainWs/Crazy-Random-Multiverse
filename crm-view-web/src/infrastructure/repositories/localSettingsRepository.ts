import Settings, { SettingName, SettingValue } from '@/domain/settings/Settings';

type MinimalSettings = Map<SettingName, SettingValue>;

const saveSettings = (settings: Settings): void => {
  const jsonSettings = parseToJson(settings);
  localStorage.setItem('settings', jsonSettings);
};

function parseToJson(settings: Settings): string {
  const minimalSettings: MinimalSettings = new Map();
  minimalSettings.set('username', settings.getSettingValue('username'));

  return JSON.stringify(minimalSettings);
}

const findSettingByName = (settingName: SettingName): SettingValue => {
  return findAllSettings().getSettingValue(settingName);
};

const findAllSettings = (): Settings => {
  const jsonSettings = localStorage.getItem('settings');
  if (!jsonSettings) {
    return new Settings();
  }

  return parseToObject(jsonSettings);
};

function parseToObject(stringObject: string): Settings {
  const settings = new Settings();

  const minimalSettings: MinimalSettings = JSON.parse(stringObject);
  minimalSettings.forEach((value, name) => settings.setSettingValue(name, value));

  return settings;
}

export default {
  saveSettings,
  findSettingByName,
  findAllSettings
};
