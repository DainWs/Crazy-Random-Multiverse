import { BrowserWindow } from 'electron';
import { WindowConfiguration } from '../config/WindowConfiguration';
import { Updater } from '../version/Updater';
import { View, createDefault } from '../view/View';

const IS_IN_DEV_MODE = process.env.APP_IS_DEV ? true : false;

export default class MainWindow {
    private browserWindow?: BrowserWindow;
    private currentView: View;

    public constructor() {
        this.browserWindow = undefined;
        this.currentView = createDefault();
    }

    public initialize(config: WindowConfiguration) {
        this.browserWindow = new BrowserWindow({
            width: config.resolution.width, 
            height: config.resolution.height,
            fullscreen: config.screenMode.isMaximized,
            frame: !config.screenMode.isFrameless,
            darkTheme: config.darkTheme,
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
            show: false,
            webPreferences: {
                preload: "./preload.js",
                devTools: !IS_IN_DEV_MODE
            }
        });

        this.browserWindow.webContents.openDevTools();
        console.log("Dev tools up")
        if (!IS_IN_DEV_MODE) Updater.checkForUpdates();

        this.currentView.load(this.browserWindow);
        this.browserWindow.show();
    }
}