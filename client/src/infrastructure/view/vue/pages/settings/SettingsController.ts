import { getSettingSections, getSettings, setSettings } from '@/application/settingsService';
import { SettingName, SettingValue } from '@/domain/settings/Settings';
import SettingSection from '@/domain/settings/SettingSection';
import router from '@vue-root/configuration/router';
import { ref } from 'vue';

const selectedSection = ref(('general' as SettingSection));
const changedSettings = new Map<SettingName, SettingValue>();

const getAllSettings = () => {
  return getSettings();
};

const getAvailableSettingSections = () => {
  return getSettingSections();
};

const isCurrentSettingSection = (settingSection: SettingSection) => {
  return selectedSection.value == settingSection;
}

const onSettingChange = (settingName: SettingName, settingValue: SettingValue) => {
  changedSettings.set(settingName, settingValue);
  setSettings(changedSettings);
  changedSettings.clear();
};

const onSettingSectionClick = (settingSection: SettingSection) => {
  selectedSection.value = settingSection;
  router.push(`/settings/${settingSection}`);
};

const onBackClick = () => {
  router.push('/');
};

export default {
  isCurrentSettingSection,
  getSettings: getAllSettings,
  getAvailableSettingSections,
  onSettingChange,
  onSettingSectionClick,
  onBackClick
};
