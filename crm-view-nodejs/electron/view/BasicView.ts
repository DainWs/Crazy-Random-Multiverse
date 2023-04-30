import { BrowserView, BrowserWindow } from "electron";
import { View } from "./View";
import path from "path";

const isInDevMode = process.env.APP_IS_DEV ? true : false;

export default class BasicView implements View {
    private url: string;

    constructor() {
        this.url = `file://${path.join(__dirname, '../index.html')}`;
        if (isInDevMode) {
            this.url = 'http://localhost:3000';
        }
    }

    load(window: BrowserWindow): void {
        console.log(window.getBrowserView());

        const view = new BrowserView();
        //window.setBrowserView(view)

        window.webContents.loadURL(this.url);
/*
        window.loadURL(this.url)
            .then(console.log, console.log)
            .finally(() => {
                console.log(window.getBrowserView());
                console.log("content: ");
                console.log(window.webContents);

                window.loadURL("http://127.0.0.1:8887/")
                    .then(console.log, console.log)
                    .finally(() => {
                        console.log(window.getBrowserView());
                        console.log("content: ");
                        console.log(window.webContents);
                    });
            });*/
    }
}