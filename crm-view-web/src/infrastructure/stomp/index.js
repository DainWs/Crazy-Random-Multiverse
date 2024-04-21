import messageBroker from "@/infrastructure/stomp/broker";
import { Client } from "@stomp/stompjs";

/**
 * @type {Client}
 */
let stompClient = undefined;

const createSessionWithUsername = (username) => {
    stompClient =  new Client({
        brokerURL: `ws://${process.env.SERVER_HOST}/ws`,
        connectHeaders: { username },
        reconnectDelay: 100,
        debug: (message) => console.log(message),
    });

	stompClient.onConnect = (frame) => messageBroker.onConnect(stompClient, frame);
    stompClient.onDisconnect = (frame) => messageBroker.onDisconnect(stompClient, frame);
    stompClient.onStompError = (frame) =>messageBroker.onStompError(frame);
    stompClient.activate();
}

const send = async (destination, message = undefined) => {
	let body = message
	if (message !== undefined) {
		body = JSON.stringify(message)
	}

	await stompClient.publish({ destination, body })
}

export { createSessionWithUsername };
export default { send };