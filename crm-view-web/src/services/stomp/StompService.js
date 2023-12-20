import StompMessageHandler from '@/services/stomp/StompMessageHandler';

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

function sendSync(destination, message = undefined) {
	let body = message
	if (message !== undefined) {
		body = JSON.stringify(message)
	}

	stompClient.publish({ destination, body })
}

function onConnect() {
	isConnected = true;
	stompClient.subscribe('/user/topic/user/info', StompMessageHandler.onUserInfo);
	stompClient.subscribe('/user/topic/party/info', StompMessageHandler.onPartyInfo);
	stompClient.subscribe('/user/topic/party/list', StompMessageHandler.onPartyList);
	stompClient.subscribe('/user/topic/error', StompMessageHandler.onGameError);
	stompClient.subscribe('/user/topic/event', StompMessageHandler.onGameEvent);
	log('Connected')
}

function onDisconnect() {
	isConnected = false
	log('Disconnected')
}

function onStompError() {
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
	send,
	sendSync
}