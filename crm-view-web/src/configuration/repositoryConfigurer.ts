import User from '@/domain/models/User';
import { settingsRepository, userRepository } from '@repositories/index';

const configureRepositories = () => {
    configureSettingsRepository();
    configureUserRepository();
}

function configureSettingsRepository() {
    const username = settingsRepository.findSettingByName('username');
    if (!username) {
        const settings = settingsRepository.findAllSettings();
        settings.username =  `user_${new Date().getTime()}`;
        settingsRepository.saveSettings(settings);
    }
}

function configureUserRepository() {
    const username = settingsRepository.findSettingByName('username');
    if (!username) {
        throw new Error('Username not found');
    }

    userRepository.updateCurrentUser(new User(username));
}

export {
    configureRepositories
};