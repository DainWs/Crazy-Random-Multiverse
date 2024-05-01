import router from '@/infrastructure/view/vue/configuration/router';
import {
  getSettingSections,
  getSettings,
  setSettings
} from '@/application/settingsService';

/**
 * @type {Map.<string, any>}
 */
const changedSettings = new Map();

const saveChanges = () => {
  const settings = new Array();

  changedSettings.forEach((value, key) =>
    settings.push({ name: key, value: value })
  );
  changedSettings.clear();

  setSettings(settings);
};

const getAllSettings = () => {
  return getSettings();
};

const getAvailableSettingSections = () => {
  return getSettingSections();
};

const onSettingChange = setting => {
  changedSettings.set(setting.name, setting.value);
};

const onSettingSectionClick = settingSection => {
  const settingSectionRoute = settingSection.name.toLowerCase();
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
