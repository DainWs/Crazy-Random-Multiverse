package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.player.Player;

public class SurrenderAction extends PlayerTurnAction {

	@Override
	protected boolean performPlayerAction(ActionContext context) {
		Zone zone = context.getSourceZone();
		zone.removeAllCombatants();

		Player sourcePlayer = context.getSourcePlayer();	
		sourcePlayer.die();

		this.notifyActionEvent(EventCode.PLAYER_SURRENDER, context);
		return true;
	}
}
