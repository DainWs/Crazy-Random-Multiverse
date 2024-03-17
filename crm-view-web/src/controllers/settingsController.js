import { updateUserInfo } from '@/api/v1.js';
import settingsService from '@/services/settings/settingsService'

const settigns = settingsService.getSettings();

const getUsername = () => {
    return settigns.username;
}

const setUsername = async (newUsername) => {
    if (newUsername != undefined) {
        settigns.username = newUsername
    }
}

const persistUsername = async () => {
    settingsService.setUsername(settigns.username);
    updateUserInfo({username: settigns.username});
}

export default {
    getUsername,
    setUsername,
    persistUsername
}