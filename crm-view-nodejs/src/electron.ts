'use strict'

import { app, BrowserWindow, protocol } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { loadWindowConfiguration } from './electron/CRMStorage'
import { checkForUpdates } from './electron/CRMUpdater'
const isDevelopment: boolean = process.env.NODE_ENV !== 'production'
const nodeIntegration: boolean = !isDevelopment

protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
    const windowConfiguration: any = loadWindowConfiguration();
    const browserWindow = new BrowserWindow({
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
        show: false,
        title: 'Crazy Random Multiverses',
        icon: './icon.png',
        backgroundColor: '#000000',
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#2f3241',
            symbolColor: '#74b1be',
            height: 20
        },
        webPreferences: {
            preload: `${__dirname}/preload.js`,
            devTools: isDevelopment,
            nodeIntegration: nodeIntegration,
            contextIsolation: !nodeIntegration
        }
    });

    if (isDevelopment) {
        await browserWindow.loadURL('http://localhost:8080/')
        if (!process.env.IS_TEST) browserWindow.webContents.openDevTools()
    }
    else {
        checkForUpdates();
        browserWindow.loadURL('app://./index.html')
    }

    browserWindow.show()
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady()
    .then(async () => {
        if (isDevelopment && !process.env.IS_TEST) {
            try {
                await installExtension(VUEJS_DEVTOOLS)
            } catch (e: any) {
                console.error('Vue Devtools failed to install:', e.toString())
            }
        }

        createWindow()
    })

if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
