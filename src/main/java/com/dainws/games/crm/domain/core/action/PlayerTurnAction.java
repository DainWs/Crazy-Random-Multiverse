package com.dainws.games.crm.domain.core.action;

import java.lang.System.Logger;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.event.EventPublisher;
import com.dainws.games.crm.domain.exception.ActionAllowedOnTurnException;
import com.dainws.games.crm.domain.exception.PlayerActionException;

public abstract class PlayerTurnAction implements Action {

	protected EventPublisher eventPublisher;
	protected Logger logger;

	public PlayerTurnAction() {
		this.eventPublisher = EventPublisher.NONE;
		this.logger = System.getLogger(LOGGER_NAME);
	}
	
	@Override
	public final void perform(ActionContext context) throws ActionAllowedOnTurnException, PlayerActionException {
		Game game = context.getGame();
		Player playerWithTurn = game.getPlayerWithTurn();
		Player sourcePlayer = context.getSourcePlayer();

		if (!playerWithTurn.equals(sourcePlayer)) {
			throw new ActionAllowedOnTurnException(sourcePlayer);
		}

		this.performPlayerAction(context);
	}

	protected abstract void performPlayerAction(ActionContext context) throws PlayerActionException;
	
	protected void notifyActionEvent(EventCode eventCode, ActionContext context) {
		this.eventPublisher.publish(new ActionEvent(eventCode, context));
	}

	@Override
	public void setEventPublisher(EventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;		
	}
}
