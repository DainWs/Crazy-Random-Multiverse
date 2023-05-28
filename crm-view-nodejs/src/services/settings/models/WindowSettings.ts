import { defaultResolution, Resolutions, WindowResolution } from "./window/WindowResolution";
import { defaultDisplayMode, DisplayMode, DisplayModes } from "./window/WindowDisplayMode";

export interface WindowSettings {
    resolution: WindowResolution
    displayMode: DisplayMode
}

export const defaultWindowSettings: WindowSettings = {
    resolution: defaultResolution,
    displayMode: defaultDisplayMode,
}

class WindowSettingsParser {
    public parseToObject(stringObject: string): WindowSettings {
        const object = JSON.parse(stringObject)
        const resolution = Resolutions.get(object.resolution)
        const displayMode = DisplayModes.get(object.displayMode)
    
        return {
            resolution: (resolution == undefined) ? defaultWindowSettings.resolution : resolution,
            displayMode: (displayMode == undefined) ? defaultWindowSettings.displayMode : displayMode
        }
    }

    public parseToJson(windowSettings: WindowSettings): string {
        const minimalWindowSettings = {
            resolution: windowSettings.resolution.name,
            displayMode: windowSettings.displayMode.name
        }
    
        return JSON.stringify(minimalWindowSettings);
    }
}

const INSTANCE = new WindowSettingsParser()
export { INSTANCE as windowSettingsParser }