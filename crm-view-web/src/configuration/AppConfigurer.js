import { createSessionWithUsername } from "@/infrastructure/stomp";
import { getSetting } from "@/application/settingsService";

const configureApp = () => {
    const username = getSetting('username');
    createSessionWithUsername(username);
}

export {
    configureApp
}