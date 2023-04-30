import { contextBridge } from "electron";
import { loadWindowConfiguration, saveWindowConfiguration } from "./CRMStorage";
import { checkForUpdates } from "./CRMUpdater";

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  checkForUpdates: () => checkForUpdates()
})

contextBridge.exposeInMainWorld('settings', {
  loadWindowConfiguration: () => loadWindowConfiguration(),
  saveWindowConfiguration: (config: any) => saveWindowConfiguration(config)
})