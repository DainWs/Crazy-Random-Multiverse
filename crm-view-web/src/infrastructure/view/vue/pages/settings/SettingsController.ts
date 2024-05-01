import {
  Setting,
  SettingName,
  SettingSection
} from '@/domain/SettingsRepository';
import {
  getSettingSections,
  getSettings,
  setSettings
} from '@/application/settingsService';
import router from '@vue-root/configuration/router';

const changedSettings = new Map<SettingName, Setting>();

const getAllSettings = () => {
  return getSettings();
};

const getAvailableSettingSections = () => {
  return getSettingSections();
};

const saveChanges = () => {
  setSettings(Array.from(changedSettings.values()));
  changedSettings.clear();
};

const onSettingChange = (setting: Setting) => {
  changedSettings.set(setting.name, setting);
};

const onSettingSectionClick = (settingSection: SettingSection) => {
  const settingSectionRoute = settingSection.name;
  router.push(`/settings/${settingSectionRoute}`);
};

const onBackClick = () => {
  router.push('/');
};

export default {
  saveChanges,
  getSettings: getAllSettings,
  getAvailableSettingSections,
  onSettingChange,
  onSettingSectionClick,
  onBackClick
};
