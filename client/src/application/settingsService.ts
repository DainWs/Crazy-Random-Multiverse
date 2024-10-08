import User from '@/domain/models/User';
import Settings, { SettingName, SettingValue } from '@/domain/settings/Settings';
import { getSettingSections as getSections } from '@/domain/settings/SettingSection';
import { sendRefreshUserInfo, sendUpdateUserInfo } from '@/infrastructure/api/v1';
import { userRepository, settingsRepository } from '@/infrastructure/repositories';

type SettingsMap = Map<SettingName, SettingValue>;

const getSettingSections = () => {
  return getSections();
};

const getSettings = () => {
  return settingsRepository.findAllSettings();
};

const getSetting = (settingName: SettingName) => {
  return settingsRepository.findSettingByName(settingName);
};

const setSettings = (settings: SettingsMap) => {
  console.log(settings)
  updateUserInfoIfHasChange(settings);

  const currentSettings = settingsRepository.findAllSettings();
  applyChanges(currentSettings, settings);

  settingsRepository.saveSettings(currentSettings);
};

function applyChanges(currentSettings: Settings, newSettings: SettingsMap) {
  newSettings.forEach((value, key) => {
    currentSettings.setSettingValue(key, value);
  });
}

function updateUserInfoIfHasChange(settings: SettingsMap) {
  const currentSettings = settingsRepository.findAllSettings();
  const usernameSetting = settings.get('username');

  if (usernameSetting && currentSettings.isSettingEquals('username', usernameSetting)) {
    const user = userRepository.getCurrentUser();
    user.username = usernameSetting;
    sendUpdateUserInfo(user);
    setTimeout(sendRefreshUserInfo, 500);
  }
}

export { getSettingSections, setSettings, getSettings, getSetting };
