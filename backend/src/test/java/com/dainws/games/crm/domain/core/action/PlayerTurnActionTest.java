package com.dainws.games.crm.domain.core.action;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameLifeCycle.Status;
import com.dainws.games.crm.domain.core.GameStatusSetter;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode.Code;
import com.dainws.games.crm.domain.core.player.Player;

public abstract class PlayerTurnActionTest implements ActionTest {
	
	@Test
	@Override
	public void testGivenContext_whenPerform_thenActionIsPerformed() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
				
		assertTrue(turnAction.perform(actionContext).isSuccessful());
	}
	
	@Test
	void testGivenPlayerWithoutTurn_whenPerform_thenActionIsNotPerformed() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		Player playerWithoutTurn = this.getPlayerWithoutTurn(actionContext);
		actionContext.setSourcePlayer(playerWithoutTurn);
		
		assertFalse(turnAction.perform(actionContext).isSuccessful());
	}
	
	@Test
	void testGivenPlayerWithoutTurn_whenPerform_thenCodeIsAllowedOnlyOnTurn() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		Player playerWithoutTurn = this.getPlayerWithoutTurn(actionContext);
		actionContext.setSourcePlayer(playerWithoutTurn);

		ActionResult result = turnAction.perform(actionContext);

		assertThat(result.getExceptionCode()).isEqualTo(new PlayerActionExceptionCode(Code.ALLOWED_ONLY_ON_TURN));
	}

	@Test
	void testGivenPlayerWithTurn_whenPerform_thenActionIsPerformed() throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		Player playerWithTurn = this.getPlayerWithTurn(actionContext);
		actionContext.setSourcePlayer(playerWithTurn);

		assertTrue(turnAction.perform(actionContext).isSuccessful());
	}
	
	// TURN-7
	@ParameterizedTest
	@EnumSource(value = Status.class, names = { "CREATED", "LOADING", "ENDED" })
	void testGivenGameNotInProgress_whenPerform_thenCodeIsGameNotInProgress(Status status) throws GameException {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		GameStatusSetter.setStatus(actionContext.getGame(), status);

		ActionResult result = turnAction.perform(actionContext);

		assertThat(result.getExceptionCode()).isEqualTo(new PlayerActionExceptionCode(Code.GAME_NOT_IN_PROGRESS));
	}

	protected abstract CustomActionContext createActionContext() throws GameException;
	protected abstract PlayerTurnAction createPlayerTurnAction();
	
	private Player getPlayerWithTurn(CustomActionContext actionContext) {
		return this.getPlayerWithTurn(actionContext.getGame());
	}
	
	protected final Player getPlayerWithTurn(Game game) {
		return game.getPlayerWithTurn();
	}
	
	private Player getPlayerWithoutTurn(CustomActionContext actionContext) {
		return this.getPlayerWithoutTurn(actionContext.getGame());
	}
	
	protected final Player getPlayerWithoutTurn(Game game) {
		Player playerWithTurn = game.getPlayerWithTurn();
		
		return game.getPlayers().stream()
			.filter(player -> !player.equals(playerWithTurn))
			.findAny()
			.orElseThrow();
	}
	
	protected final Card getAnyPlayerCard(Player player) {
		return player.getHand()
				.getCards()
				.stream()
				.findAny()
				.orElseThrow();
	}
	
	protected final Card getAnyPlayerCard(Player player, CardType type) {
		return player.getHand()
				.getCardsOf(type)
				.stream()
				.findAny()
				.orElseThrow();
	}
	
	protected final Zone getZoneOfPlayerWithTurn(Game game) {
		Player playerWithTurn = game.getPlayerWithTurn();
		return this.getZoneOfPlayer(game, playerWithTurn);
	}
	
	protected final Zone getZoneOfPlayer(Game game, Player player) {
		return game.getBoard().getZoneOf(player);
	}
	
	protected final Coordinate getAvaibleCoordinateOnPlayerZone(Game game, Player player) {
		Board board = game.getBoard();
		Zone zone = board.getZoneOf(player);
		
		int verticalIndex = this.getFirstLineWithAvaibleSpace(zone);
		int horizontalIndex = this.getFirstLineEmptySpace(zone, verticalIndex);

		return new Coordinate(verticalIndex, horizontalIndex);
	}
	
	protected final int getFirstLineWithAvaibleSpace(Zone zone) {
		int verticalIndex = -1;
		boolean lineIsFilled = false;

		do {
			verticalIndex++;
			lineIsFilled = zone.isFilledAt(verticalIndex);
		} 
		while(lineIsFilled && verticalIndex < zone.getVerticalDimension());

		if (lineIsFilled) {
			throw new RuntimeException("None line with avaible space");
		}

		return verticalIndex;
	}
	
	protected final int getFirstLineEmptySpace(Zone zone, int rowIndex) {
		int horizontalIndex = -1;
		boolean hasCombatant = false;

		do {
			horizontalIndex++;
			hasCombatant = zone.hasCombatant(new Coordinate(rowIndex, horizontalIndex));
		} 
		while(hasCombatant && horizontalIndex < zone.getHorizontalDimension(rowIndex));

		if (hasCombatant) {
			throw new RuntimeException("None avaible space on line");
		}

		return horizontalIndex;
	}
}
