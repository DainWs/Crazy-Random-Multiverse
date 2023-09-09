package com.dainws.games.cbg.domain.player.actions;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.card.Warrior;
import com.dainws.games.cbg.domain.card.WarriorFactory;
import com.dainws.games.cbg.domain.player.LinePosition;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.PlayerFactory;
import com.dainws.games.cbg.domain.player.Position;
import com.dainws.games.cbg.domain.player.SquarePosition;
import com.dainws.games.cbg.domain.player.Zone;

class PutCardActionTest {
	
	Player player;
	
	@BeforeEach
	void beforeEach() {
		this.player = new PlayerFactory().createBasicPlayer();
	}
	
	@Test
	void testGivenPlayerWithWarriorAndTargetPosition_whenExecute_thenPutWarriorInTargetPosition() {
		Warrior warrior = new WarriorFactory().createBasicWarrior();
		this.player.getHand().addCard(warrior);
		Position targetPosition = new Position(LinePosition.BACK, SquarePosition.LEFT);
		PutAction action = new PutAction(this.player, warrior.getCode(), targetPosition);
		
		action.execute();
		
		Zone zone = this.player.getZone();
		Combatant combatant = zone.getCombatant(targetPosition);
		assertTrue(combatant.equals(warrior));
	}
	
	
}
