package com.dainws.games.crm.domain.ai;

import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.event.EventTrigger;
import com.dainws.games.crm.domain.error.ErrorHandler;
import com.dainws.games.crm.domain.exception.PlayerActionException;

public class ActionExecutor implements EventTrigger {
	private EventPublisher eventPublisher;
	private ErrorHandler errorHandler;

	public ActionExecutor() {
		this.eventPublisher = EventPublisher.NONE;
		this.errorHandler = new ErrorHandler();
	}

	public void execute(AIAction aiAction) {
		try {
			Action action = aiAction.getAction();
			action.setEventPublisher(this.eventPublisher);
			action.perform(aiAction.getContext());
		} catch (PlayerActionException exception) {
			this.errorHandler.notifyErrorToPlayer(exception.getSource(), exception.toError());
		}
	}

	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}

	public void setErrorHandler(ErrorHandler errorHandler) {
		this.errorHandler = errorHandler;
	}
}
