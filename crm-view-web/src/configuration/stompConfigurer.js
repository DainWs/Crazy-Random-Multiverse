import { Client } from "@stomp/stompjs";
import stompAdapter from "@/repositories/api/stomp/adapter";
import { getSetting } from "@/application/settingsService";

const configureStomp = () => {
    const username = getSetting('username');
    console.log(CRM_SERVER_HOST)
    const stompClient =  new Client({
        brokerURL: `ws://${CRM_SERVER_HOST}/ws`,
        connectHeaders: { username },
        reconnectDelay: 100,
        debug: (message) => console.log(message),
    });

    stompAdapter.setClient(stompClient);
    stompClient.activate();
}

export { configureStomp }