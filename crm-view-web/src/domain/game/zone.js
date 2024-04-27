/**
 * @typedef {import('@/domain/player').Player} Owner
 * @typedef {import('@/domain/zone').Zone} Zone
 */


/**
 * @param {Owner} player
 * @param {Zone} zone
 */
const isPlayerOwnerOfZone = (player, zone) => {
    return zone.owner.code === player.code;
}

export {
    isPlayerOwnerOfZone
}