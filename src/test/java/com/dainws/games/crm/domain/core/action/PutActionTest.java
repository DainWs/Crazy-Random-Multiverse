package com.dainws.games.crm.domain.core.action;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.tools.domain.builder.CardBuilder;
import com.dainws.games.crm.tools.domain.builder.GameBuilder;
import com.dainws.games.crm.tools.domain.core.board.DummyZone;

class PutActionTest extends PlayerTurnActionTest {

	@Test
	void testGivenContext_whenPerform_thenCoordinateNowHasCombatant() throws PlayerActionException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();

		turnAction.perform(actionContext);

		Zone zone = actionContext.getTargetZone();
		assertTrue(zone.hasCombatant(actionContext.getTargetCoordinate()));
	}

	@Test
	void testGivenContext_whenPerform_thenPutCardInCoordinate() throws PlayerActionException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();

		turnAction.perform(actionContext);

		Zone zone = actionContext.getTargetZone();
		assertThat(zone.getCombatant(actionContext.getTargetCoordinate()))
			.isEqualTo(actionContext.getSourceCard());
	}

	@Test
	void testGivenContextWithFilledCoordinate_whenPerform_thenThrowPlayerActionException() {
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
		return new PutAction();
	}

	@Override
	protected CustomActionContext createActionContext() {
		Game game = new GameBuilder().withNRandomPlayers(5).build();

		Player playerWithTurn = this.getPlayerWithTurn(game);
		playerWithTurn.getHand().addCard(new CardBuilder().buildFullValidWarrior());
		Card warriorCard = this.getAnyPlayerCard(playerWithTurn, CardType.WARRIOR);
		Coordinate targetCoordinate = this.getAvaibleCoordinateOnPlayerZone(game, playerWithTurn);
		game.getBoard().setZone(playerWithTurn, new DummyZone());

		CustomActionContext actionContext = new CustomActionContext();
		actionContext.setGame(game);
		actionContext.setSourcePlayer(playerWithTurn);
		actionContext.setSourceCard(warriorCard);

		actionContext.setTargetPlayer(playerWithTurn);
		actionContext.setTargetCoordinate(targetCoordinate);
		actionContext.setTargetCard(warriorCard);
		return actionContext;
	}
}
