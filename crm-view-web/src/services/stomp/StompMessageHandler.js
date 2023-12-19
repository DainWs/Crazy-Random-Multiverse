const Topics = {
	USER_INFO: "userInfo",
	PARTY_INFO: "partyInfo",
	PARTY_LIST: "partyList",
	GAME_EVENT: "gameEvent",
	GAME_ERROR: "gameError"
}

const topicSubscribers = new Map()
topicSubscribers.set(Topics.USER_INFO, new Map())
topicSubscribers.set(Topics.PARTY_INFO, new Map())
topicSubscribers.set(Topics.PARTY_LIST, new Map())
topicSubscribers.set(Topics.GAME_EVENT, new Map())
topicSubscribers.set(Topics.GAME_ERROR, new Map())

function subscribe(id, topic, callback) {
	topicSubscribers.get(topic).set(id, callback)
}

function unsubscribe(id, topic) {
	topicSubscribers.get(topic).delete(id)
}

function onUserInfo(message) {
	notifyMessageToTopicSubscribers(Topics.USER_INFO, message)
}

function onPartyInfo(message) {
	notifyMessageToTopicSubscribers(Topics.PARTY_INFO, message)
}

function onPartyList(message) {
	notifyMessageToTopicSubscribers(Topics.PARTY_LIST, message)
}

function onGameEvent(message) {
	console.log(message)
	notifyMessageToTopicSubscribers(Topics.GAME_EVENT, message)
}

function onGameError(message) {
	notifyMessageToTopicSubscribers(Topics.GAME_ERROR, message)
}

function notifyMessageToTopicSubscribers(topic, message) {
	let subscribers = topicSubscribers.get(topic)
	subscribers.forEach((callback, _) => callback(message))
}

export default {
	Topics,

	subscribe,
	unsubscribe,

	onUserInfo,
	onPartyInfo,
	onPartyList,
	onGameEvent,
	onGameError
}