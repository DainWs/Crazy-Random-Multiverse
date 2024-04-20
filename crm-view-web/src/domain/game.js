import { isPlayerOwnerOfZone } from '@/domain/zone';

/**
 * @typedef {import('@/domain/player').Player} Player
 * @typedef {import('@/domain/zone').Zone} Zone
 * @typedef {import('@/domain/game').GameCode} GameCode
 * @typedef {import('@/domain/game').Game} Game
 */

/**
 * @param {Game} game
 * @returns {Player[]}
 */
const getPlayersFrom = (game) => {
    return game.zones.map(zone => zone.owner);
}

/**
 * @param {Game} game 
 * @param {Player} player 
 * @returns {Zone}
 */
const getPlayerZoneFrom = (game, player) => {
    return game.zones.find(zone => isPlayerOwnerOfZone(player, zone));
}

export {
    getPlayersFrom,
    getPlayerZoneFrom
}