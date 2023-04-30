const electron = require('electron')
const electron_updater = require('electron-updater')

var app = electron.app
var autoUpdater = electron_updater.autoUpdater

function onUpdateDownloaded(info) {
    electron.dialog.showMessageBox({
        title: `Version ${info.version} is now here!`,
        type: 'info',
        message: `We'll close you app and update it now`,
        buttons: ['ok'],
    })
    .then(autoUpdater.quitAndInstall.bind(autoUpdater, true, true));
}

if (app.isPackaged) {
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.addListener('update-downloaded', (info) => onUpdateDownloaded(info));
}

exports.checkForUpdates = function() {
    if (app.isPackaged) {
        autoUpdater.checkForUpdates();
    }
}