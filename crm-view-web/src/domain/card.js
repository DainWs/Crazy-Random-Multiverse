/**
 * @typedef {import('@/domain/card').Card} Card
 * @typedef {import('@/domain/card').CardType} CardType
 */

/**
 * @param {Card} card
 * @param {CardType} type
 * @returns {boolean}
 */
const isCardOfType = (card, type) => {
    return card.type === type
}

/**
 * @param {Card} card
 * @returns {boolean}
 */
const isCardACombatant = (card) => {
    return isCardOfType(card, 'LEADER') || isCardOfType(card, 'WARRIOR');
}

/**
 * @param {Card} card
 * @returns {string}
 */
const getCardTypeDescription = (card) => {
    if (isCardOfType(card, 'WARRIOR')) {
        return card.rarity;
    }
    return card.type;
}


/**
 * @param {Card} card
 * @returns {boolean}
 */
const hasCardStatistics = (card) => {
    return isCardACombatant(card) || isCardOfType(card, 'EQUIPMENT');
}

export {
    isCardOfType,
    isCardACombatant,
    getCardTypeDescription,
    hasCardStatistics
}