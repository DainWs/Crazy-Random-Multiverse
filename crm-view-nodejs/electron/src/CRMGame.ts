import { app } from 'electron'
import MainWindow from './window/MainWindow'

class CRMGame {
    private window: MainWindow

    public constructor() {
        this.window = new MainWindow()
    }

    public start() {
        app.whenReady().then(this.onReady.bind(this))
        app.on('window-all-closed', this.onAllWindowClosed.bind(this))
    }

    private onReady() {
        this.window.initialize();
    }

    private onAllWindowClosed() {
        app.quit()
    }
}

export default CRMGame