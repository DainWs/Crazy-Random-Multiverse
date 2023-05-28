import { ProfileSettings } from "./AppSettings";

export const defaultProfileSettings: ProfileSettings = {
    username: 'user'
}

class ProfileSettingsParser {
    public parseToObject(stringObject: string): ProfileSettings {
        const object = JSON.parse(stringObject)
    
        return {
            username: object.username
        }
    }

    public parseToJson(settings: ProfileSettings): string {
        const minimalSettings = {
            resolution: settings.username
        }
    
        return JSON.stringify(minimalSettings);
    }
}

const INSTANCE = new ProfileSettingsParser()
export { INSTANCE as profileSettingsParser }
