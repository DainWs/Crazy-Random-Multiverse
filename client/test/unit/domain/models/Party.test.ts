import partyFactory from '@test/domain/partyFactory';

describe('Party - Unit tests', () =>{
  test('Users capacity should have \'userCount/maxUsers\' format', () => {
    const party = partyFactory.createParty();

    expect(party.getUserCapacity()).toMatch(/^[0-9]+\/[0-9]+$/);
  });

  test('Should have full capacity', () => {
    const party = partyFactory.createParty(undefined, undefined, 4, 4);

    expect(party.isFullCapacity()).toBeTruthy();
  });

  test('Shouldm\'t have full capacity', () => {
    const party = partyFactory.createParty(undefined, undefined, 2, 4);

    expect(party.isFullCapacity()).toBeFalsy();
  });
});