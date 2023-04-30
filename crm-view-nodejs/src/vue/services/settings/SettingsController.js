class SettingsController {
    appSettings;
    constructor() {
        this.appSettings = {
            general: {
                window: settings.loadWindowConfiguration()
            }
        };
    }
    getGeneralConfiguration() {
        return this.appSettings.general;
    }
}
console.log(settings);
console.log(window);
const INSTANCE = new SettingsController();
export { INSTANCE as settingsController };
//# sourceMappingURL=SettingsController.js.map