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
}

export { SettingName, SettingValue };
export default Settings;
