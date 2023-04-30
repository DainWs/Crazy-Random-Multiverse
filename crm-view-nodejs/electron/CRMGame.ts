import { app, BrowserWindow } from 'electron'
import { createServer }  from 'http'
import { loadWindowConfiguration } from './config/StoreConfig'
import { WindowConfiguration } from './config/WindowConfiguration'
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
        const server = createServer(function (req, res) {
            res.write('Hello World!'); //write a response to the client
            res.end(); //end the response
          }).listen(8080); //the server object listens on port 8080


        let windowConfiguration: WindowConfiguration = loadWindowConfiguration();
        this.window.initialize(windowConfiguration);
    }

    private onAllWindowClosed() {
        app.quit()
    }

}

export default CRMGame