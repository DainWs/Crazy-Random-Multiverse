import { contextBridge } from "electron";
import { WindowConfiguration } from './config/WindowConfiguration'
import { loadWindowConfiguration, saveWindowConfiguration } from "./config/StoreConfig";

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})


contextBridge.exposeInMainWorld('settings', {
  loadWindowConfiguration: () => loadWindowConfiguration(),
  saveWindowConfiguration: (config: WindowConfiguration) => saveWindowConfiguration(config)
})