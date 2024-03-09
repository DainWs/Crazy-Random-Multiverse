import router from "@/configuration/vueRouter"
import StompDestinations from "@/services/stomp/StompDestinations"
import StompService from "@/services/stomp/StompService"

async function process(event, currentContext) {
    console.log("############# Game Event: 'Game create' received")
    const game = event.details.game
    console.log(game)
    
    const userUid = currentContext.user.uid
    let player = findPlayer(game, userUid)
    if (player == undefined) {
        player = createSpectator(currentContext.user)
    }

    currentContext.game = game
    currentContext.player = player;
    currentContext.hand = { cards: new Array() }; // TODO player hand initialization
    console.log("current context initialized:")
    console.log(currentContext)

    router.push('/game')

    StompService.send(StompDestinations.GAME_READY)
}

function findPlayer(game, userUid) {
    return game.zones.find(zone => {
        console.log("zone:")
        console.log(zone)
        const zoneOwner = zone.owner
        console.log("zone owner:")
        console.log(zoneOwner)
        return (zoneOwner.code == userUid)
    })
}

function createSpectator(user) { // TODO player hand initialization
    return {
        code: user.uid,
        name: user.username,
        isSpectator: true,
        isAlive: false
    }
}

export default {
    process
}