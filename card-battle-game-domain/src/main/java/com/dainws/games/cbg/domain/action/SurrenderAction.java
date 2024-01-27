package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.board.Board;
import com.dainws.games.cbg.domain.board.Coordinate;
import com.dainws.games.cbg.domain.board.Zone;
import com.dainws.games.cbg.domain.event.EventCode;
import com.dainws.games.cbg.domain.event.EventPublisher;
import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Player;

public class SurrenderAction implements Action {

	private EventPublisher eventPublisher;

	@Override
	public void perform(ActionContext context) throws PlayerActionException {
		assert (this.eventPublisher != null);

		Board board = context.getBoard();
		Player sourcePlayer = context.getSourcePlayer();
		Zone zone = board.getZone(sourcePlayer);
		
		this.removeAllCombatantsFrom(zone);

		this.notifyPlayerSurrenderAction(context);
	}
	
	private void removeAllCombatantsFrom(Zone zone) {
		for (int rowIndex = 0; rowIndex < zone.getVerticalDimension(); rowIndex++) {
			this.removeAllCombatantsFromRow(zone, rowIndex);
		}
	}
	
	private void removeAllCombatantsFromRow(Zone zone, int rowIndex) {
		for (int columnIndex = 0; columnIndex < zone.getHorizontalDimension(); columnIndex++) {
			Coordinate coordinate = new Coordinate(rowIndex, columnIndex);
			if (zone.hasCombatant(coordinate)) {
				zone.removeCombatant(coordinate);
			}
		}
	}
	
	private void notifyPlayerSurrenderAction(ActionContext context) {
		this.eventPublisher.publish(new ActionEvent(EventCode.PLAYER_SURRENDER, context));
	}
	
	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
