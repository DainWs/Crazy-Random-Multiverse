import messageHandler from '@/repositories/api/stomp/messageHandler';

let isConnected = false;
let stompClient = undefined;

function setClient(client) {
	stompClient = client;
	stompClient.onConnect = onConnect;
    stompClient.onDisconnect = onDisconnect;
    stompClient.onStompError = onStompError;
}

async function send(destination, message = undefined) {
	let body = message
	if (message !== undefined) {
		body = JSON.stringify(message)
	}

	await stompClient.publish({ destination, body })
}

function onConnect() {
	isConnected = true;
	stompClient.subscribe('/user/topic/user/info', messageHandler.onUserInfo);
	stompClient.subscribe('/user/topic/party/info', messageHandler.onPartyInfo);
	stompClient.subscribe('/user/topic/party/list', messageHandler.onPartyList);
	stompClient.subscribe('/user/topic/error', messageHandler.onGameError);
	stompClient.subscribe('/user/topic/event', messageHandler.onGameEvent);
	log('Connected')
}

function onDisconnect() {
	isConnected = false
	log('Disconnected')
}

function onStompError(frame) {
	log('------------------------------------------------')
	log('WS: Broker reported error: ' + frame.headers['message'])
	log('WS: Additional details: ' + frame.body)
	log('------------------------------------------------')
}

function log(message) {
    console.log(message)
}

export default {
	setClient,
	send
}