/**
 * @type {import('@/application/events/event').EventHandler}
 */
 async function handle(event, context) {
    console.log("############# Player Event: 'Player get card' received")
    console.log(event.details.targetCard)
    
}

export default {
    handle
}