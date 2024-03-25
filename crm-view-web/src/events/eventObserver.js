

import EventCodes from '@/events/eventCodes.js'



const subscribers = new Map()

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

const subscribe = (id, eventCode, callback) => {
	let subscriberList = new Array();
	if (subscribers.has(eventCode)) {
		subscriberList = subscribers.get(eventCode);
	}

	const newSubscriber = { id, callback };

	let isSubscriberWithId = subscriber => subscriber.id === newSubscriber.id; 
	if (subscriberList.some(isSubscriberWithId)) {
		let index = subscriberList.findIndex(isSubscriberWithId);
		subscriberList[index] = newSubscriber;
	} else {
		subscriberList.push(newSubscriber)
	}

	subscribers.set(eventCode, subscriberList);
}

const unsubscribe = (id, eventCode) => {
	let subscriberList = subscribers.get(eventCode);

	let isSubscriberWithId = subscriber => subscriber.id === id; 
	if (subscriberList.some(isSubscriberWithId)) {
		let index = subscriberList.findIndex(isSubscriberWithId);
		subscriberList = subscriberList.slice(index, index + 1);
	}

	subscribers.set(eventCode, subscriberList);
}

const notify = (eventCode, event) => {
	subscribers.get(eventCode)
		.forEach(subscriber => subscriber.callback(event));
}

export default {
    subscribe,
    unsubscribe,
    notify
}
