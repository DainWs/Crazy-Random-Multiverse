package com.dainws.games.cbg.domain.action;

import com.dainws.games.cbg.domain.exception.PlayerActionException;
import com.dainws.games.cbg.domain.player.Line;
import com.dainws.games.cbg.domain.player.Player;
import com.dainws.games.cbg.domain.player.Square;
import com.dainws.games.cbg.domain.player.Zone;

public class SurrenderAction implements Action {
	@Override
	public void perform(ActionContext context) throws PlayerActionException {
		Player sourcePlayer = context.getSourcePlayer();
		Zone zone = sourcePlayer.getZone();

		for (Line line : zone.getLines()) {
			this.removeCombatantsOnLine(line);
		}
	}
	
	public void removeCombatantsOnLine(Line line) {
		for (Square square : line.getSquares()) {
			square.removeCombatant();
		}
	}
}
