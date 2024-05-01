import {
  MinimalSettings,
  Settings,
  SettingName,
  SettingValue,
  SettingSection
} from '@/domain/SettingsRepository';

const saveSettings = (settings: Settings): void => {
  const jsonSettings = parseToJson(settings);
  localStorage.setItem('settings', jsonSettings);
};

const findSettingByName = (settingName: SettingName): SettingValue => {
  return findAllSettings()[settingName] ?? undefined;
};

const findAllSettings = (): Settings => {
  const jsonSettings = localStorage.getItem('settings') ?? '{}';
  return parseToObject(jsonSettings);
};

const findAllSettingSections = (): Array<SettingSection> => {
  const settingSections = new Array();
  settingSections.push({id: 1, name: 'General'});
  return settingSections;
};

function parseToJson(settings: Settings): string {
  const minimalSettings: MinimalSettings = {
    username: settings.username
  };

  return JSON.stringify(minimalSettings);
}

function parseToObject(stringObject: string): Settings {
  const minimalSettings: MinimalSettings = JSON.parse(stringObject);
  return {
    username: minimalSettings?.username
  };
}

export default {
  saveSettings,
  findSettingByName,
  findAllSettings,
  findAllSettingSections
};
