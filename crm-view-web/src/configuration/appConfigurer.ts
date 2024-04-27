import { createSessionWithUsername } from "@/infrastructure/stomp";
import { settingsRepository, userRepository } from "@/infrastructure/repositories";

const configureApp = () => {
    const username = settingsRepository.findSettingByName("username");
    userRepository.updateCurrentUser({ username });
    createSessionWithUsername(username);
}

export {
    configureApp
}