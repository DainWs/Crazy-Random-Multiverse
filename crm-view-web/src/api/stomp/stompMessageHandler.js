import Topics from '@/api/stomp/stompTopics'

const topicSubscribers = new Map()
topicSubscribers.set(Topics.USER_INFO, new Map())
topicSubscribers.set(Topics.PARTY_INFO, new Map())
topicSubscribers.set(Topics.PARTY_LIST, new Map())
topicSubscribers.set(Topics.GAME_EVENT, new Map())
topicSubscribers.set(Topics.GAME_ERROR, new Map())

const subscribe = (id, topic, callback) => {
	topicSubscribers.get(topic).set(id, callback)
}

const unsubscribe = (id, topic) => {
	topicSubscribers.get(topic).delete(id)
}

const onUserInfo = (message) => {
	notifyMessageToTopicSubscribers(Topics.USER_INFO, message)
}

const onPartyInfo = (message) => {
	console.log(message)
	notifyMessageToTopicSubscribers(Topics.PARTY_INFO, message)
}

const onPartyList = (message) => {
	console.log(message)
	// TODO no se estan usando los datos recibidos desde party list
	notifyMessageToTopicSubscribers(Topics.PARTY_LIST, message)
}

const onGameEvent = (message) => {
	console.log(message)
	notifyMessageToTopicSubscribers(Topics.GAME_EVENT, message)
}

const onGameError = (message) => {
	notifyMessageToTopicSubscribers(Topics.GAME_ERROR, message)
}

function notifyMessageToTopicSubscribers(topic, message) {
	let subscribers = topicSubscribers.get(topic)
	subscribers.forEach((callback, _) => callback(JSON.parse(message.body)))
}

export default {
	subscribe,
	unsubscribe,

	onUserInfo,
	onPartyInfo,
	onPartyList,
	onGameEvent,
	onGameError
}