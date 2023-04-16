import { BrowserWindow } from 'electron'
import BasicView from './BasicView'

export interface View {
    load(window: BrowserWindow): void
}

export function createDefault(): View {
    return new BasicView()
}
