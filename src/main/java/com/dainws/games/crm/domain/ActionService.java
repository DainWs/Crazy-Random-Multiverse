package com.dainws.games.crm.domain;

import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.ActionContextFactory;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.action.AttackAction;
import com.dainws.games.crm.domain.core.action.EquipAction;
import com.dainws.games.crm.domain.core.action.MoveAction;
import com.dainws.games.crm.domain.core.action.PutAction;
import com.dainws.games.crm.domain.core.action.SurrenderAction;
import com.dainws.games.crm.domain.error.ErrorHandler;
import com.dainws.games.crm.domain.event.ConsoleEventPublisher;
import com.dainws.games.crm.domain.event.EventPublisher;
import com.dainws.games.crm.domain.event.EventTrigger;
import com.dainws.games.crm.domain.exception.PlayerActionException;

public class ActionService implements EventTrigger {
	private ActionContextFactory contextFactory;
	private EventPublisher eventPublisher;
	private ErrorHandler errorHandler;

	public ActionService(ActionContextFactory actionContextFactory) {
		this.contextFactory = actionContextFactory;
		this.eventPublisher = new ConsoleEventPublisher();
		this.errorHandler = new ErrorHandler();
	}

	public void playerPutCard(ActionContextTemplate contextTemplate) {
		this.performAction(new PutAction(), contextTemplate);
	}

	public void playerMoveCard(ActionContextTemplate contextTemplate) {
		this.performAction(new MoveAction(), contextTemplate);
	}

	public void playerAttackCard(ActionContextTemplate contextTemplate) {
		this.performAction(new AttackAction(), contextTemplate);
	}

	public void playerEquipCard(ActionContextTemplate contextTemplate) {
		this.performAction(new EquipAction(), contextTemplate);
	}

	public void playerUseSpell(ActionContextTemplate contextTemplate) {
		this.performAction(null, contextTemplate); // TODO pending
	}

	public void playerSurrender(ActionContextTemplate contextTemplate) {
		this.performAction(new SurrenderAction(), contextTemplate);
	}

	private ActionContext createContext(ActionContextTemplate contextTemplate) {
		return this.contextFactory.createContextFromTemplate(contextTemplate);
	}

	private boolean performAction(Action action, ActionContextTemplate contextTemplate) {
		try {
			ActionContext actionContext = this.createContext(contextTemplate);
			action.setEventPublisher(this.eventPublisher);
			action.perform(actionContext);
			return true;
		} catch (PlayerActionException exception) {
			this.errorHandler.notifyErrorToPlayer(exception.getSource(), exception.toError());
			return false;
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
