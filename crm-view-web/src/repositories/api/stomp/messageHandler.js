import eventObserver from '@/events/eventObserver'

const onUserInfo = (message) => {
	triggerEvent(createEventFrom('USER_INFO_UPDATE', message));
}

const onPartyInfo = (message) => {
	triggerEvent(createEventFrom('PARTY_INFO_UPDATE', message));
}

const onPartyList = (message) => {
	triggerEvent(createEventFrom('PARTY_LIST_UPDATE', message));
}

const onGameEvent = (message) => {
	triggerEvent(JSON.parse(message.body));
}

const onGameError = (message) => {
	triggerEvent(createEventFrom('ERROR', message));
}

function createEventFrom(eventCode, message) {
	return { code: eventCode, details: JSON.parse(message.body) };
}

function triggerEvent(event) {
	eventObserver.notify(event.code, event);
}

export default {
	onUserInfo,
	onPartyInfo,
	onPartyList,
	onGameEvent,
	onGameError
}