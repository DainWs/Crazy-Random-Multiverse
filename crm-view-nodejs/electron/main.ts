import { app, BrowserWindow } from 'electron'
import { Updater } from './version/Updater';
import { loadWindowConfiguration } from './config/StoreConfig'
import { WindowConfiguration } from './config/WindowConfiguration'
import { createServer, SERVER_HOST, SERVER_PORT, SERVER_SCHEME } from './server';

const DEV_MODE_ENABLED = process.env.APP_IS_DEV ? true : false;
const SERVER = createServer();

app.on('window-all-closed', () => app.quit())
app.whenReady()
    .then(() => {
        console.log('app ready')
        let windowConfiguration: WindowConfiguration = loadWindowConfiguration();
        let browserWindow = new BrowserWindow({
            width: windowConfiguration.resolution.width,
            height: windowConfiguration.resolution.height,
            fullscreen: windowConfiguration.screenMode.isMaximized,
            frame: !windowConfiguration.screenMode.isFrameless,
            darkTheme: windowConfiguration.darkTheme,
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
                preload: `${__dirname}/preload.js`,
                devTools: DEV_MODE_ENABLED
            }
        });

        browserWindow.webContents.openDevTools()
        if (!DEV_MODE_ENABLED) Updater.checkForUpdates()

        browserWindow.loadURL(`${SERVER_SCHEME}://${SERVER_HOST}:${SERVER_PORT}`)
        browserWindow.show()
    })
