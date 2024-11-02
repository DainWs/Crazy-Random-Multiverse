package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.core.board.Zone;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisher;

public class SurrenderAction implements Action {

	@Override
	public boolean perform(ActionContext context) {
		Zone zone = context.getSourceZone();
		zone.removeAllCombatants();

		this.notifyPlayerSurrenderAction(context);
		return true;
	}

	private void notifyPlayerSurrenderAction(ActionContext context) {
		EventDetails details = this.createEventDetailsFrom(context);

		EventPublisher eventPublisher = context.getEventPublisher();
		eventPublisher.publish(EventCode.PLAYER_SURRENDER, details);
	}

	private EventDetails createEventDetailsFrom(ActionContext context) {
		EventDetails eventDetails = new EventDetails(context.getGame());
		eventDetails.setSourcePlayer(context.getSourcePlayer());
		eventDetails.setSourceCard(context.getSourceCard());
		eventDetails.setSourceCoordinate(context.getSourceCoordinate());
		eventDetails.setTargetPlayer(context.getTargetPlayer());
		eventDetails.setTargetCard(context.getTargetCard());
		eventDetails.setTargetCoordinate(context.getTargetCoordinate());
		return eventDetails;
	}
}
