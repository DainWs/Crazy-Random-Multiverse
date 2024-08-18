package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.event.EventPublisher;
import com.dainws.games.crm.domain.exception.PlayerActionException;

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
		this.eventPublisher.publish(new ActionEvent(EventCode.PLAYER_DIE, context));
	}
	
	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
