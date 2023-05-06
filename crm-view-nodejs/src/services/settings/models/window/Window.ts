import { defaultResolution, Resolutions, WindowResolution } from "./WindowResolution";
import { defaultScreenMode, ScreenMode, ScreenModes } from "./WindowScreenMode";

export interface WindowSettings {
    resolution: WindowResolution
    screenMode: ScreenMode
    darkTheme: boolean
}

export const defaultWindowSettings: WindowSettings = {
    resolution: defaultResolution,
    screenMode: defaultScreenMode,
    darkTheme: false
}

export function parseToWindowSettings(stringObject: string): WindowSettings {
    const object = JSON.parse(stringObject)
    const resolution = Resolutions.get(object.resolution)
    const screenMode = ScreenModes.get(object.screenMode)
    const darkTheme = object.darkTheme == 'TRUE'

    return {
        resolution: (resolution == undefined) ? defaultWindowSettings.resolution : resolution,
        screenMode: (screenMode == undefined) ? defaultWindowSettings.screenMode : screenMode,
        darkTheme: (darkTheme == undefined) ? defaultWindowSettings.darkTheme : darkTheme
    }
}

export function stringifyFromWindowSettings(windowSettings: WindowSettings): string {
    const minimalWindowSettings = {
        resolution: windowSettings.resolution.name,
        screenMode: windowSettings.screenMode.name,
        darkTheme: windowSettings.darkTheme,
    }

    return JSON.stringify(minimalWindowSettings);
}