import { dialog, app } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';

class Updater {
    constructor() {
        if (app.isPackaged) {
            autoUpdater.autoInstallOnAppQuit = true;
            autoUpdater.addListener('update-downloaded', this.onUpdateDownloaded.bind(this));
        }
    }

    public checkForUpdates() {
        if (app.isPackaged) {
            autoUpdater.checkForUpdates();
        }
    }

    private onUpdateDownloaded(info: UpdateInfo) {
        dialog.showMessageBox({
            title: `Version ${info.version} is now here!`,
            type: 'info',
            message: `We'll close you app and update it now`,
            buttons: ['ok'],
        })
            .then(autoUpdater.quitAndInstall.bind(autoUpdater, true, true));
    }
}

const instance: Updater = new Updater();
export { instance as Updater };