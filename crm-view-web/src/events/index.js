import eventObserver from "./eventObserver"

const waitUntilEventOccurs = (eventCode) => {
    const promiseId = `PROMISE_${Math.random()*100}`;
    return new Promise(resolve => subscribeOnetime(promiseId, eventCode, resolve));
}

function subscribeOnetime(id, eventCode, callback) {
    eventObserver.subscribe(id, eventCode, (data) => {
        eventObserver.unsubscribe(id, eventCode);
        callback(data.details);
    })
}

export {
    waitUntilEventOccurs
}