import { createCardCode, createGame, createPlayerCode, createPosition } from '@test/unit/domain/ModelFactory';

import Action from '@/domain/actions/Action';
import ActionType from '@/domain/actions/ActionType';
import ActionTarget from '@/domain/actions/ActionSource';
import ActionSource from '@/domain/actions/ActionTarget';
import ActionTrigger from '@/domain/actions/ActionTrigger';

describe('Card - Unit tests', () =>{
  describe('Generic tests', () =>{
    test('Should be of same type', (done) => {
      done.fail("Not yet implemented")
    });

    test('Should be of different type',(done) => {
      done.fail("Not yet implemented")
    });

    test('Two cards with same code should be equals',(done) => {
      done.fail("Not yet implemented")
    });
  
    test('Two cards with different code should be differents',(done) => {
      done.fail("Not yet implemented")
    });
  });

  describe('Leader tests', () =>{
    test('Should be a combatant',(done) => {
      done.fail("Not yet implemented")
    });

    test('Should have statistics',(done) => {
      done.fail("Not yet implemented")
    });

    test('TypeDescription should be same as type',(done) => {
      done.fail("Not yet implemented")
    });
  });

  
  describe('Warrior tests', () =>{
    test('Should be a combatant',(done) => {
      done.fail("Not yet implemented")
    });

    test('Should have statistics',(done) => {
      done.fail("Not yet implemented")
    });

    test('TypeDescription shouldn be same as rarity',(done) => {
      done.fail("Not yet implemented")
    });
  });

  describe('Equipment tests', () =>{
    test('Shouldn\'t be a combatant',(done) => {
      done.fail("Not yet implemented")
    });

    test('Should have statistics',(done) => {
      done.fail("Not yet implemented")
    });

    test('TypeDescription should be same as type',(done) => {
      done.fail("Not yet implemented")
    });
  });

  describe('Spell tests', () =>{
    test('Shouldn\'t be a combatant',(done) => {
      done.fail("Not yet implemented")
    });

    test('Shouldn\'t have statistics',(done) => {
      done.fail("Not yet implemented")
    });

    test('TypeDescription should be same as type',(done) => {
      done.fail("Not yet implemented")
    });
  });
})