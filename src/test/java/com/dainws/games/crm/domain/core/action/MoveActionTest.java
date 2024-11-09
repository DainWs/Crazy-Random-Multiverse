package com.dainws.games.crm.domain.core.action;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.exception.ExceptionPublisher;
import com.dainws.games.crm.domain.core.exception.OperationNotAllowedException;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.tools.domain.builder.CardBuilder;
import com.dainws.games.crm.tools.domain.builder.GameBuilder;

class MoveActionTest extends PlayerTurnActionTest {

	@Test
	void testGivenContext_whenPerform_thenTargetCoordinateHasCombatant() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();

		turnAction.perform(actionContext);

		Zone zone = actionContext.getTargetZone();
		assertTrue(zone.hasCombatant(actionContext.getTargetCoordinate()));
	}

	@Test
	void testGivenContext_whenPerform_thenSourceCoordinateHasntCombatant() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();

		turnAction.perform(actionContext);

		Zone zone = actionContext.getTargetZone();
		assertFalse(zone.hasCombatant(actionContext.getSourceCoordinate()));
	}

	@Test
	void testGivenContext_whenPerform_thenMoveCardToCoordinate() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();

		turnAction.perform(actionContext);

		Zone zone = actionContext.getTargetZone();
		assertThat(zone.getCombatant(actionContext.getTargetCoordinate())).isEqualTo(actionContext.getSourceCard());
	}

	@Test
	void testGivenContextWithFilledCoordinate_whenPerform_thenThrowPlayerActionException()
			throws OperationNotAllowedException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		Warrior filledWithCard = new CardBuilder().buildFullValidWarrior();
		Zone targetZone = actionContext.getTargetZone();
		Coordinate coordinate = actionContext.getTargetCoordinate();
		targetZone.putCombatant(coordinate, filledWithCard);

		assertThrows(PlayerActionException.class, () -> turnAction.perform(actionContext));
	}

	@Override
	protected PlayerTurnAction createPlayerTurnAction() {
		return new MoveAction();
	}

	@Override
	protected CustomActionContext createActionContext() throws OperationNotAllowedException {
		Game game = new GameBuilder().withNRandomPlayers(5).build();

		Player playerWithTurn = this.getPlayerWithTurn(game);
		Zone zone = this.getZoneOfPlayerWithTurn(game);
		Coordinate coordinate = this.getAvaibleCoordinateOnPlayerZone(game, playerWithTurn);
		Warrior warriorCard = new CardBuilder().buildFullValidWarrior();
		zone.putCombatant(coordinate, warriorCard);

		Coordinate targetCoordinate = this.getAvaibleCoordinateOnPlayerZone(game, playerWithTurn);
		CustomActionContext actionContext = new CustomActionContext();
		actionContext.setGame(game);
		actionContext.setSourcePlayer(playerWithTurn);
		actionContext.setSourceCard(warriorCard);
		actionContext.setSourceCoordinate(coordinate);

		actionContext.setTargetPlayer(playerWithTurn);
		actionContext.setTargetCoordinate(targetCoordinate);
		actionContext.setTargetCard(warriorCard);
		return actionContext;
	}
}
