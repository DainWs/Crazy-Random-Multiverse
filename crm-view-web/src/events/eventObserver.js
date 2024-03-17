

import EventCodes from '@/events/eventCodes.js'

const topicSubscribers = new Map()
topicSubscribers.set(Topics.USER_INFO, new Map())
topicSubscribers.set(Topics.PARTY_INFO, new Map())
topicSubscribers.set(Topics.PARTY_LIST, new Map())
topicSubscribers.set(Topics.GAME_EVENT, new Map())
topicSubscribers.set(Topics.GAME_ERROR, new Map())

function subscribe(id, eventCode, callback) {
	topicSubscribers.get(eventCode).set(id, callback)
}

function unsubscribe(id, eventCode) {
	topicSubscribers.get(eventCode).delete(id)
}

function onUserInfo(message) {
	notifyMessageToTopicSubscribers(Topics.USER_INFO, message)
}

function onPartyInfo(message) {
	console.log(message)
	notifyMessageToTopicSubscribers(Topics.PARTY_INFO, message)
}

function onPartyList(message) {
	console.log(message)
	// TODO no se estan usando los datos recibidos desde party list
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
	subscribers.forEach((callback, _) => callback(JSON.parse(message.body)))
}
const subscribe = (id, eventCode, callback) => {}
const unsubscribe = (id, eventCode) => {}

const notify = (eventCode, event) => {

}

export default {
    subscribe,
    unsubscribe,
    notify
}
