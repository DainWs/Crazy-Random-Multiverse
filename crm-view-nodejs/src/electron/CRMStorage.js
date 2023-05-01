const ElectronStore = require('electron-store')

const appConfig = new ElectronStore({
    name: 'crm-app-config',
    defaults: {
        setting: {
            window: {
                resolution: { width: 1280, height: 720 },
                screenMode: { name: 'Windowed', isMaximized: false, isFrameless: false },
                darkTheme: false
            }
        },
    },
    schema: {
        setting: {
            type: 'object',
            properties: {
                window: {
                    type: 'object',
                    properties: {
                        resolution: {
                            type: 'object',
                            properties: {
                                width: { type: 'integer' },
                                height: { type: 'integer' }
                            },
                            additionalProperties: false
                        },
                        screenMode: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                isMaximized: { type: 'boolean' },
                                isFrameless: { type: 'boolean' }
                            },
                            additionalProperties: true
                        },
                        darkTheme: { type: 'boolean' },
                    },
                    required: ['resolution', 'screenMode', 'darkTheme'],
                    additionalProperties: false
                }
            },
            required: ['window'],
            additionalProperties: false
        },
    },
});

const SettingsStorage = {
    loadWindowConfiguration: () => appConfig.get('setting.window'),
    saveWindowConfiguration: (config) => appConfig.set('setting.window', config)
}

module.exports = SettingsStorage