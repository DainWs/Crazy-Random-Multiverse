import { getSettingSections, getSettings, setSettings } from '@/application/settingsService';
import { SettingName, SettingValue } from '@/domain/settings/Settings';
import SettingSection from '@/domain/settings/SettingSection';
import router from '@vue-root/configuration/router';

const changedSettings = new Map<SettingName, SettingValue>();

const getAllSettings = () => {
  return getSettings();
};

const getAvailableSettingSections = () => {
  return getSettingSections();
};

const saveChanges = () => {
  setSettings(changedSettings);
  changedSettings.clear();
};

const onSettingChange = (settingName: SettingName, settingValue: SettingValue) => {
  changedSettings.set(settingName, settingValue);
};

const onSettingSectionClick = (settingSection: SettingSection) => {
  router.push(`/settings/${settingSection}`);
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
