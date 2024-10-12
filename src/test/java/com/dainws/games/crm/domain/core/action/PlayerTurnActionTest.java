package com.dainws.games.crm.domain.core.action;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.exception.PlayerActionTurnRequiredException;
import com.dainws.games.crm.domain.core.player.Player;

public abstract class PlayerTurnActionTest implements ActionTest {
	
	@Test
	@Override
	public void testGivenContext_whenPerform_thenActionIsPerformed() {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
				
		assertDoesNotThrow(() -> turnAction.perform(actionContext));
	}
	
	@Test
	void testGivenPlayerWithoutTurn_whenPerform_thenThrowActionAllowedOnTurnException() {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		Player playerWithoutTurn = this.getPlayerWithoutTurn(actionContext);
		actionContext.setSourcePlayer(playerWithoutTurn);
		
		assertThrows(PlayerActionTurnRequiredException.class, () -> turnAction.perform(actionContext));
	}
	
	@Test
	void testGivenPlayerWithTurn_whenPerform_thenActionIsPerformed() {
		PlayerTurnAction turnAction = this.createPlayerTurnAction();
		CustomActionContext actionContext = this.createActionContext();
		Player playerWithTurn = this.getPlayerWithTurn(actionContext);
		actionContext.setSourcePlayer(playerWithTurn);

		assertDoesNotThrow(() -> turnAction.perform(actionContext));
	}
	
	protected abstract CustomActionContext createActionContext();
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
