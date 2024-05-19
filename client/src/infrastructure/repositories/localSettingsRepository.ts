import decrypt from 'decr';
import Settings, { SettingName, SettingValue } from '@/domain/settings/Settings';

const s3cr3t = '';

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
  return JSON.parse(atob(atob(stringObject)));
}

export default {
  saveSettings,
  findSettingByName,
  findAllSettings
};
