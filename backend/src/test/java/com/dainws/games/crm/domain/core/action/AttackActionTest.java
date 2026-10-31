package com.dainws.games.crm.domain.core.action;

import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.exception.NotAllowedException;
import com.dainws.games.crm.domain.core.player.Player;

class AttackActionTest extends PlayerTurnActionTest {

	private static final Coordinate ATTACKER_COORDINATE = new Coordinate(0, 0);
	private static final Coordinate TARGET_COORDINATE = new Coordinate(0, 0);
	private static final Coordinate FRONT_ROW_COORDINATE = new Coordinate(1, 0);

	@Test
	void testGivenTargetWithCombatantInFrontRow_whenPerform_thenDoNotPerformAction() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		this.fillRowAndPutInFrontRow(actionContext.getTargetZone());

		assertFalse(turnAction.perform(actionContext));
	}

	@Override
	protected PlayerTurnAction createPlayerTurnAction() {
		return new AttackAction();
	}

	@Override
	protected CustomActionContext createActionContext() throws NotAllowedException {
		Game game = new GameBuilder().withNRandomPlayers(5).build();
		Player attacker = this.getPlayerWithTurn(game);
		Player defender = this.getPlayerWithoutTurn(game);
		Warrior attackerCard = new CardBuilder().buildFullValidWarrior();
		Warrior defenderCard = new CardBuilder().buildFullValidWarrior();
		this.getZoneOfPlayer(game, attacker).putCombatant(ATTACKER_COORDINATE, attackerCard);
		this.getZoneOfPlayer(game, defender).putCombatant(TARGET_COORDINATE, defenderCard);

		CustomActionContext actionContext = new CustomActionContext();
		actionContext.setGame(game);
		actionContext.setSourcePlayer(attacker);
		actionContext.setSourceCard(attackerCard);
		actionContext.setSourceCoordinate(ATTACKER_COORDINATE);
		actionContext.setTargetPlayer(defender);
		actionContext.setTargetCard(defenderCard);
		actionContext.setTargetCoordinate(TARGET_COORDINATE);
		return actionContext;
	}

	private void fillRowAndPutInFrontRow(Zone zone) throws NotAllowedException {
		for (int column = 1; column < zone.getHorizontalDimension(0); column++) {
			zone.putCombatant(new Coordinate(0, column), new CardBuilder().buildFullValidWarrior());
		}

		zone.putCombatant(FRONT_ROW_COORDINATE, new CardBuilder().buildFullValidWarrior());
	}
}
