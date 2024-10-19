package com.dainws.games.crm.domain.core.player;

import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.event.EventTrigger;
import com.dainws.games.crm.domain.core.exception.GameExceptionHandler;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;

public class PlayerActionExecutor implements EventTrigger {
	private EventPublisher eventPublisher;
	private GameExceptionHandler exceptionHandler;

	public PlayerActionExecutor() {
		this.eventPublisher = EventPublisher.NONE;
		this.exceptionHandler = GameExceptionHandler.NONE;
	}

	public boolean execute(Action action, ActionContext actionContext) {
		try {
			action.setEventPublisher(this.eventPublisher);
			action.perform(actionContext);
			return true;
		} catch (PlayerActionException exception) {
			exception.printStackTrace();
			this.exceptionHandler.handle(exception);
			return false;
		}
	}

	public void setExceptionHandler(GameExceptionHandler exceptionHandler) {
		this.exceptionHandler = exceptionHandler;
	}

	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}
}
