package com.dainws.games.crm.domain.core.action;

import com.dainws.games.crm.domain.event.Event;
import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.event.EventDetails;

public class ActionEvent extends Event {

	public ActionEvent(EventCode code, ActionContext context) {
		super(code);
		this.setDetails(this.createEventDetailsFrom(context));
	}
	
	private EventDetails createEventDetailsFrom(ActionContext context) {
		EventDetails eventDetails = new EventDetails();
		eventDetails.setGame(context.getGame());
		eventDetails.setSourcePlayer(context.getSourcePlayer());
		eventDetails.setSourceCard(context.getSourceCard());
		eventDetails.setSourceCoordinate(context.getSourceCoordinate());
		eventDetails.setTargetPlayer(context.getTargetPlayer());
		eventDetails.setTargetCard(context.getTargetCard());
		eventDetails.setTargetCoordinate(context.getTargetCoordinate());
		return eventDetails;
	}

}
