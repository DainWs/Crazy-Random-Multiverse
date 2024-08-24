package com.dainws.games.crm.domain;

import com.dainws.games.crm.domain.core.action.Action;
import com.dainws.games.crm.domain.core.action.ActionContext;
import com.dainws.games.crm.domain.core.action.ActionContextFactory;
import com.dainws.games.crm.domain.core.action.ActionContextTemplate;
import com.dainws.games.crm.domain.core.action.ActionExecutor;
import com.dainws.games.crm.domain.core.action.AttackAction;
import com.dainws.games.crm.domain.core.action.EquipAction;
import com.dainws.games.crm.domain.core.action.MoveAction;
import com.dainws.games.crm.domain.core.action.PutAction;
import com.dainws.games.crm.domain.core.action.SurrenderAction;
import com.dainws.games.crm.domain.error.ErrorHandler;
import com.dainws.games.crm.domain.event.EventBasedAction;
import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.event.EventPublisher;
import com.dainws.games.crm.domain.event.EventTrigger;
import com.dainws.games.crm.domain.exception.PlayerActionException;

public class ActionFacade implements ActionExecutor, EventTrigger {
	private ActionContextFactory contextFactory;
	private EventPublisher eventPublisher;
	private ErrorHandler errorHandler;

	public ActionFacade(ActionContextFactory actionContextFactory) {
		this.contextFactory = actionContextFactory;
		this.eventPublisher = EventPublisher.NONE;
		this.errorHandler = new ErrorHandler();
	}

	public void playerPutCard(ActionContextTemplate contextTemplate) {
		this.executeEventBasedAction(EventCode.PLAYER_PUT_CARD, new PutAction(), contextTemplate);
	}

	public void playerMoveCard(ActionContextTemplate contextTemplate) {
		this.executeEventBasedAction(EventCode.PLAYER_MOVE_CARD, new MoveAction(), contextTemplate);
	}

	public void playerAttackCard(ActionContextTemplate contextTemplate) {
		this.executeEventBasedAction(EventCode.PLAYER_ATTACK_CARD, new AttackAction(), contextTemplate);
	}

	public void playerEquipCard(ActionContextTemplate contextTemplate) {
		this.executeEventBasedAction(EventCode.PLAYER_EQUIP_CARD, new EquipAction(), contextTemplate);
	}

	public void playerUseSpell(ActionContextTemplate contextTemplate) {
		this.executeEventBasedAction(EventCode.PLAYER_USE_SPELL, null, contextTemplate); // TODO pending
	}

	public void playerSurrender(ActionContextTemplate contextTemplate) {
		this.executeEventBasedAction(EventCode.PLAYER_SURRENDER, new SurrenderAction(), contextTemplate);
	}

	private ActionContext createContext(ActionContextTemplate contextTemplate) {
		return this.contextFactory.createContextFromTemplate(contextTemplate);
	}

	public boolean executeEventBasedAction(EventCode code, Action action, ActionContextTemplate contextTemplate) {
		EventBasedAction eventBasedAction = new EventBasedAction(code, action);
		eventBasedAction.setEventPublisher(this.eventPublisher);
		return this.execute(eventBasedAction, contextTemplate);
	}

	@Override
	public boolean execute(Action action, ActionContextTemplate contextTemplate) {
		try {
			ActionContext actionContext = this.createContext(contextTemplate);
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
