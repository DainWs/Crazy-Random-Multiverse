import { navigateTo } from '@/infrastructure/view';
import { sendReadyToPlay } from '@/infrastructure/api/v1';

/**
 * @type {import('@/application/events').EventHandler}
 */
async function handle(event, context) {
  console.log("############# Game Event: 'Game create' received");
  const game = event.details.game;
  console.log(game);

  const userUid = context.user.uid;
  let player = findPlayer(game, userUid);
  if (player == undefined) {
    player = createSpectator(context.user);
  }

  context.game = game;
  context.player = player;
  context.hand = { cards: [] }; // TODO player hand initialization
  console.log('current context initialized:');
  console.log(context);

  navigateTo('/game');
  sendReadyToPlay(game.code);
}

function findPlayer(game, userUid) {
  return game.zones.find((zone) => {
    console.log('zone:');
    console.log(zone);
    const zoneOwner = zone.owner;
    console.log('zone owner:');
    console.log(zoneOwner);
    return zoneOwner.code == userUid;
  });
}

function createSpectator(user) {
  // TODO player hand initialization
  return {
    code: user.uid,
    name: user.username,
    isSpectator: true,
    isAlive: false
  };
}

export default {
  handle
};
