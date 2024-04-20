
/**
 * @typedef {import('@/application/events/event').Event} Event
 * @typedef {import('@/application/events/event').EventCode} EventCode
 * @typedef {import('@/application/events/event').EventHandler} EventHandler
 */

/**
 * @typedef Subscriber
 * @property {String} id
 * @property {EventHandler} eventHandler
 */

/**
 * @type {Map<EventCode, Array<Subscriber>}
 */
const subscribers = new Map();

/**
 * @param {String} id
 * @param {EventCode} eventCode 
 * @param {EventHandler} eventHandler 
 */
const subscribe = (id, eventCode, eventHandler) => {
	let subscriberList = new Array();
	if (subscribers.has(eventCode)) {
		subscriberList = subscribers.get(eventCode);
	}

	const newSubscriber = { id, eventHandler };

	const subscriberIndex = getSubscriberIndexById(subscriberList, id);
	if (subscriberIndex) {
		subscriberList[index] = newSubscriber;
	} else {
		subscriberList.push(newSubscriber);
	}

	subscribers.set(eventCode, subscriberList);
}

/**
 * @param {String} id
 * @param {EventCode} eventCode 
 */
const unsubscribe = (id, eventCode) => {
	let subscriberList = subscribers.get(eventCode);

	const subscriberIndex = getSubscriberIndexById(subscriberList, id);
	if (subscriberIndex) {
		subscriberList = subscriberList.slice(subscriberIndex, subscriberIndex + 1);
		subscribers.set(eventCode, subscriberList);
	}
}

/**
 * @param {EventCode} eventCode 
 * @param {Event} event 
 */
const notify = (eventCode, event) => {
	subscribers.get(eventCode)
		.forEach(subscriber => subscriber.eventHandler(event));
}

function getSubscriberIndexById(subscriberList, id) {
	const isSubscriberWithId = subscriber => subscriber.id === id; 
	if (subscriberList.some(isSubscriberWithId)) {
		return subscriberList.findIndex(isSubscriberWithId);
	}
	return null;
}

export default {
    subscribe,
    unsubscribe,
    notify
}
