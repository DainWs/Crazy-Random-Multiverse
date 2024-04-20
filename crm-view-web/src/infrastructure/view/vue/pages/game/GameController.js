import { triggerAction } from "@/application/actionService";
import { getPlayerZoneFrom } from "@/domain/game";
import { ref } from "vue";

/**
 * @typedef GameReference
 * @property {import("@/domain/game").Game} value
 */

/**
 * @typedef PlayerReference
 * @property {import("@/domain/player").Player} value
 */

/**
 * @type {GameReference}
 */
const game = ref({
  playerWithTurn: { code: "1", name: "DainWs" },
  zones: [
    {
      owner: { code: "1", name: "DainWs" },
      health: 100,
      maxHealth: 100,
      combatants: [
        [null, null, null],
        [null, null, null],
        [{
          code: "12",
          name: "Santo Franshuaaa",
          description: "Un falso santo", type: "LEADER",

          damage: 10,
          damageType: "PHYSICAL",
          armor: 0,
          armorType: "PHYSICAL",
          health: 100,
          maxHealth: 100
        }]
      ]
    },
    {
      owner: { code: "2", name: "Alberto" },
      health: 100,
      maxHealth: 100,
      combatants: [
        [null, null, null],
        [null, null, null],
        [null]
      ]
    },
    {
      owner: { code: "3", name: "Alfredo" },
      health: 70,
      maxHealth: 100,
      combatants: [
        [null, null, null],
        [null, null, null],
        [null]
      ]
    },
    {
      owner: { code: "4", name: "Gordi" },
      health: 10,
      maxHealth: 100,
      combatants: [
        [null, null, null],
        [null, null, null],
        [null]
      ]
    },
    {
      owner: { code: "5", name: "Javier" },
      health: 50,
      maxHealth: 100,
      combatants: [
        [null, null, null],
        [null, null, null],
        [null]
      ]
    }
  ]
});

/**
 * @type {PlayerReference}
 */
const playerInfo = ref({
  code: '1',
  name: 'DainWs',
  isAlive: true,
  isSpectator: false
});

const previewedZone = ref(playerInfo)

const getReactiveGame = () => {
  return game;
}

const getReactivePlayerInfo = () => {
  return playerInfo;
}

const getReactivePreviewedZone = () => {
  return previewedZone;
}

const onZoneSelect = (zone) => {
  previewedZone.value = zone;
}

const onActionPerformed = async (source, target) => {
  console.log("Source:");
  console.log(source);
  console.log("Target:");
  console.log(target);
  await triggerAction(source, target);
}

export default {
  getReactiveGame,
  getReactivePlayerInfo,
  getReactivePreviewedZone,
  onZoneSelect,
  onActionPerformed
}