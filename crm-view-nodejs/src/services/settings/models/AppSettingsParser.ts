import AppSettings from "./AppSettings"
import { findByName as findResolutionByName } from "./WindowResolution"
import { findByName as findDisplayModeByName } from "./WindowDisplayMode"

const parseToObject = function(stringObject: string): AppSettings {
    const object = JSON.parse(stringObject)
    return {
        username: object.username ?? `user_${new Date().getTime()}`,
        general: {
            resolution: findResolutionByName(object.general.resolution),
            displayMode: findDisplayModeByName(object.general.displayMode),
        }
    }
}

const parseToJson = function(appSettings: AppSettings): string {
    const minimalSettings = {
        username: appSettings.username,
        general: {
            resolution: appSettings.general.resolution.name,
            displayMode: appSettings.general.displayMode.name
        }
    }

    return JSON.stringify(minimalSettings);
}

export default {
    parseToObject,
    parseToJson
}