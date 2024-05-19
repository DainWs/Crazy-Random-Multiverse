import playerFactory from '@test/domain/playerFactory';
import zoneFactory from '@test/domain/zoneFactory';

describe('Game - Unit tests', () =>{
  test('Should be zone owner', () => {
    const player = playerFactory.createPlayer();
    const zone = zoneFactory.createZone(player);

    expect(zone.isPlayerOwner(player)).toBeTruthy();
  });

  test('Shouldn\'t be zone owner', () => {
    const zone = zoneFactory.createZone();
    const player = playerFactory.createPlayer();

    expect(zone.isPlayerOwner(player)).toBeFalsy();
  });
});