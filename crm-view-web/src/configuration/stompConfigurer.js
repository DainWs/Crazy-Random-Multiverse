import { createSessionWithUsername } from "@/infrastructure/stomp";
import { getSetting } from "@/application/settingsService";

const configureStomp = () => {
    const username = getSetting('username');
    createSessionWithUsername(username);
}

export { configureStomp }