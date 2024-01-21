package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.board.Board;
import com.dainws.games.cbg.domain.board.Coordinate;
import com.dainws.games.cbg.domain.board.Zone;
import com.dainws.games.cbg.domain.card.Combatant;
import com.dainws.games.cbg.domain.event.Event;
import com.dainws.games.cbg.domain.event.EventCode;
import com.dainws.games.cbg.domain.event.EventHandler;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Player;

public class SurrenderAction implements Action {

	private EventHandler eventHandler;

	@Override
	public void perform(ActionContext context) throws PlayerActionException {
		assert (this.eventHandler != null);

		Board board = context.getBoard();
		Player sourcePlayer = context.getSourcePlayer();
		Zone zone = board.getZone(sourcePlayer);
		Combatant[][] combatants = zone.getCombatants();
		
		for (int rowIndex = 0; rowIndex < combatants.length; rowIndex++) {
			for (int columnIndex = 0; columnIndex < combatants[rowIndex].length; columnIndex++) {
				Coordinate coordinate = new Coordinate(rowIndex, columnIndex);
				if (zone.hasCombatant(coordinate)) {
					zone.removeCombatant(coordinate);
				}
			}
		}

		this.notifyPlayerSurrenderAction(context);
	}
	
	private void notifyPlayerSurrenderAction(ActionContext context) {
		Event event = new ActionEvent(EventCode.PLAYER_SURRENDER, context);
		this.eventHandler.notifyEventToPlayers(context.getGame().getPlayers(), event);
	}
	
	@Override
	public void setEventHandler(EventHandler eventHandler) {
		this.eventHandler = eventHandler;
	}
}
