import gameFactory from '@test/domain/gameFactory';

describe('Game - Unit tests', () =>{
  const game = gameFactory.createGame();

  test('Should return correct player zone', () => {
    const player = game.getPlayers()[0];

    const zone = game.getPlayerZone(player);

    expect(zone?.isPlayerOwner(player)).toBeTruthy();
  });
});