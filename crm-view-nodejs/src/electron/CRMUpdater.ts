import { dialog, app } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';

function onUpdateDownloaded(info: UpdateInfo) {
    dialog.showMessageBox({
        title: `Version ${info.version} is now here!`,
        type: 'info',
        message: `We'll close you app and update it now`,
        buttons: ['ok'],
    })
    .then(autoUpdater.quitAndInstall.bind(autoUpdater, true, true));
}

if (app.isPackaged) {
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.addListener('update-downloaded', (info: UpdateInfo) => onUpdateDownloaded(info));
}

export function checkForUpdates(): void {
    if (app.isPackaged) {
        autoUpdater.checkForUpdates();
    }
}