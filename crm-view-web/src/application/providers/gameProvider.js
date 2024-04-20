
/**
 * @typedef {import('@/domain/game').Game} Game
 */

const stock = {
    game: undefined
};

/**
 * @param {Game} game 
 */
const supply = (game) => {
    stock.game = game;
}

/**
 * @returns {Game|undefined}
 */
const provide = () => {
    return stock.game;
}

export default {
    supply,
    provide
}