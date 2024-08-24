package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Board;
import com.dainws.games.crm.domain.core.board.Coordinate;
import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.exception.PlayerActionException;

public class SurrenderAction implements Action {

	@Override
	public void perform(ActionContext context) throws PlayerActionException {
		Board board = context.getBoard();
		Player sourcePlayer = context.getSourcePlayer();
		Zone zone = board.getZone(sourcePlayer);

		this.removeAllCombatantsFrom(zone);
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
}
