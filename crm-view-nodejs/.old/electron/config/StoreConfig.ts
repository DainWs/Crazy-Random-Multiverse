import ElectronStore from 'electron-store';
import { Resolutions, ScreenModes, WindowConfiguration } from './WindowConfiguration';

const DefaultWindowConfiguration: WindowConfiguration = {
    resolution: Resolutions._1280x720,
    screenMode: ScreenModes.Windowed,
    darkTheme: false
}

const appConfig = new ElectronStore({
    name: 'crm-app-config',
    defaults: {
        setting: {
            window: DefaultWindowConfiguration
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

export function loadWindowConfiguration(): WindowConfiguration {
    return appConfig.get('setting.window');
}

export function saveWindowConfiguration(config: WindowConfiguration): void {
    appConfig.set('setting.window', config);
}