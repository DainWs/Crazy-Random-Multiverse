import { SettingName, SettingValue } from '@/domain/settings/Settings';
import { getSettingSections as getSections } from '@/domain/settings/SettingSection';
import { sendRefreshUserInfo, sendUpdateUserInfo } from '@/infrastructure/api/v1';
import settingsRepository from '@/infrastructure/repositories/localSettingsRepository';

const getSettingSections = () => {
  return getSections();
};

const getSettings = () => {
  return settingsRepository.findAllSettings();
};

const getSetting = (settingName) => {
  return settingsRepository.findSettingByName(settingName);
};

/**
 * @param {Map<SettingName, SettingValue>} settings
 */
const setSettings = (settings) => {
  updateUserInfoIfHasChange(settings);

  const currentSettings = settingsRepository.findAllSettings();
  applyChanges(currentSettings, settings);

  settingsRepository.saveSettings(currentSettings);
};

function applyChanges(currentSettings, newSettings) {
  newSettings.forEach((setting) => {
    if (currentSettings[setting.name] !== undefined) {
      currentSettings[setting.name] = setting.value;
    }
  });
}

function updateUserInfoIfHasChange(settings) {
  const currentSettings = settingsRepository.findAllSettings();

  if (settings.username && settings.username !== currentSettings.getSetting('username')) {
    sendUpdateUserInfo({ username: settings.username });
    setTimeout(sendRefreshUserInfo, 500);
  }
}

export { getSettingSections, setSettings, getSettings, getSetting };
