import { updateLocalUser } from '@/application/userService';
import { updateLocalPartyInfo, updateLocalPartyList } from '@/application/partyService';
import { processGameError, processGameEvent } from '@/application/gameService';

/**
 * @typedef Client
 * @type {import('@stomp/stompjs').Client}
 */

/**
 * @typedef Frame
 * @type {import('@stomp/stompjs').Frame}
 */

/**
 * @param {Client} stompClient 
 * @param {Frame} frame 
 */
const onConnect = (stompClient, frame) => {
	stompClient.subscribe('/user/topic/user/info', onUserInfoMessage);
	stompClient.subscribe('/user/topic/party/info', onPartyInfoMessage);
	stompClient.subscribe('/user/topic/party/list', onPartyListMessage);
	stompClient.subscribe('/user/topic/error', onGameErrorMessage);
	stompClient.subscribe('/user/topic/event', onGameEventMessage);
	log('Connected')
}

/**
 * @param {Client} stompClient 
 * @param {Frame} frame 
 */
const onDisconnect = (stompClient, frame) => {
	stompClient.unsubscribe('/user/topic/user/info', onUserInfoMessage);
	stompClient.subscribe('/user/topic/party/info', onPartyInfoMessage);
	stompClient.subscribe('/user/topic/party/list', onPartyListMessage);
	stompClient.subscribe('/user/topic/error', onGameErrorMessage);
	stompClient.subscribe('/user/topic/event', onGameEventMessage);
	log('Disconnected')
}

/**
 * @param {Frame} frame 
 */
const onStompError = (frame) => {
	log('------------------------------------------------')
	log('WS: Broker reported error: ' + frame.headers['message'])
	log('WS: Additional details: ' + frame.body)
	log('------------------------------------------------')
}

function onUserInfoMessage(message) {
	updateLocalUser(JSON.parse(message.body));
}

function onPartyInfoMessage(message) {
	updateLocalPartyInfo(JSON.parse(message.body));
}

function onPartyListMessage(message) {
	updateLocalPartyList(JSON.parse(message.body));
}

function onGameEventMessage(message) {
	processGameEvent(JSON.parse(message.body));
}

function onGameErrorMessage(message) {
	processGameError(JSON.parse(message.body));
}

function log(message) {
    console.log(message)
}

export default {
	onConnect,
	onDisconnect,
	onStompError
}