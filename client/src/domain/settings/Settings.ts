type SettingName = 'username';
type SettingValue = string | undefined;

class Settings {
  public username: SettingValue;

  public constructor() {
    this.username = `user-${Math.floor(Math.random() * 1000000)}`;
  }

  public setSettingValue(settingName: SettingName, settingValue: SettingValue): void {
    this[settingName] = settingValue;
  }

  public getSettingValue(settingName: SettingName): SettingValue {
    return this[settingName];
  }

  public isSettingEquals(settingName: SettingName, settingValue: SettingValue) {
    return this[settingName] == settingValue;
  }
}

export { SettingName, SettingValue };
export default Settings;
