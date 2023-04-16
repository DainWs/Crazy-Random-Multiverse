import { BrowserWindow } from "electron";
import { View } from "./View";

export default class BasicView implements View {
    load(window: BrowserWindow): void {
        window.loadFile('./public/BasicView.html')
        window.webContents.openDevTools()
    }
}