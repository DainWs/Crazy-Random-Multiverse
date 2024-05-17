import Settings, { SettingName, SettingValue } from '@/domain/settings/Settings';

type MinimalSettings = Map<SettingName, SettingValue>;

const saveSettings = (settings: Settings): void => {
  const jsonSettings = parseToJson(settings);
  console.log(jsonSettings);
  localStorage.setItem('settings', jsonSettings);
};

function parseToJson(settings: Settings): string {
  const minimalSettings: MinimalSettings = new Map();
  minimalSettings.set('username', settings.getSettingValue('username'));
  console.log(minimalSettings);
  return JSON.stringify(minimalSettings); // TODO no es posible pasar un mapa a string, tiene que ser un objeto
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

  const minimalSettings: MinimalSettings = JSON.parse(stringObject);
  if (minimalSettings) {
    console.log(minimalSettings);
    minimalSettings.forEach((value, name) => settings.setSettingValue(name, value));
  }

  return settings;
}

export default {
  saveSettings,
  findSettingByName,
  findAllSettings
};
