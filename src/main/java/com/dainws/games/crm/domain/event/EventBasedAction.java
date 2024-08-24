package com.dainws.games.crm.domain.event;

import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.exception.PlayerActionException;

public class EventBasedAction implements Action, EventTrigger {

	private EventPublisher eventPublisher;
	private EventCode code;
	private Action action;
	
	public EventBasedAction(EventCode code, Action action) {
		this.eventPublisher = EventPublisher.NONE;
		this.code = code;
		this.action = action;
	}

	@Override
	public void perform(ActionContext context) throws PlayerActionException {
		assert (this.eventPublisher != null);

		this.action.perform(context);

		EventDetails details = this.createEventDetailsFrom(context);
		Event event = new Event(this.code, details);
		this.eventPublisher.publish(event);
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
	
	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
