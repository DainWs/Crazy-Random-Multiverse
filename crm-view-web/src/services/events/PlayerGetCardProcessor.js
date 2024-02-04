async function process(event, currentContext) {
    console.log("############# Player Event: 'Player get card' received")
    console.log(event.details.targetCard)
    
}

export default {
    process
}