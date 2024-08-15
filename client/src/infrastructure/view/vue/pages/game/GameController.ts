import Game from '@/domain/models/Game';
import Player from '@/domain/models/Player';
import { ref } from 'vue';
import Zone from '@/domain/models/Zone';
import ActionParts from '@/domain/actions/ActionParts';

const game = ref<Game>();
const playerInfo = ref<Player>();
const visibleZone = ref<Zone>();

const getReactiveGame = () => {
  return game;
};

const getReactivePlayerInfo = () => {
  return playerInfo;
};

const getReactiveVisibleZone = () => {
  return visibleZone;
};

const onZoneSelect = (zone: Zone) => {
  visibleZone.value = zone;
};

const onActionPerformed = async (event: ActionParts) => {
  console.log('Source:');
  console.log(event.source);
  console.log('Target:');
  console.log(event.target);
};

export default {
  getReactiveGame,
  getReactivePlayerInfo,
  getReactiveVisibleZone,
  onZoneSelect,
  onActionPerformed
};
