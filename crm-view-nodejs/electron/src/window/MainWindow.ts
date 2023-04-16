import { BrowserWindow } from 'electron';
import { DefaultWindowConfiguration, WindowConfiguration } from '../config/WindowConfig';
import { View, createDefault } from '../view/View';

export default class MainWindow {
    private browserWindow: BrowserWindow
    private currentView: View

    public constructor() {
        this.currentView = createDefault();
    }

    public initialize(config: WindowConfiguration = DefaultWindowConfiguration) {
        this.browserWindow = new BrowserWindow({
            width: config?.resolution.width || DefaultWindowConfiguration.resolution.width, 
            height: config?.resolution.height || DefaultWindowConfiguration.resolution.height,
            fullscreen: config?.screenMode.isMaximized || DefaultWindowConfiguration.screenMode.isMaximized,
            frame: !(config?.screenMode.isFrameless || DefaultWindowConfiguration.screenMode.isFrameless),
            darkTheme: config?.darkTheme || DefaultWindowConfiguration.darkTheme,
            center: true,
            resizable: false,
            minimizable: true,
            maximizable: true,
            fullscreenable: true,
            title: 'Crazy Random Multiverses',
            icon: './icon.png',
            backgroundColor: '#000000',
            titleBarStyle: 'hidden',
            titleBarOverlay: {
                color: '#2f3241',
                symbolColor: '#74b1be',
                height: 20
            },
            show: false
        });

        this.currentView.load(this.browserWindow)
        this.browserWindow.show()
    }
}