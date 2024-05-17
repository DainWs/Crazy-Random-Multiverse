package com.dainws.games.crm.domain.models.action;

import java.lang.System.Logger;

import com.dainws.games.crm.domain.event.ConsoleEventPublisher;
import com.dainws.games.crm.domain.event.EventCode;
import com.dainws.games.crm.domain.event.EventPublisher;
import com.dainws.games.crm.domain.exception.PlayerActionException;
import com.dainws.games.crm.domain.models.Game;
import com.dainws.games.crm.domain.models.player.Player;

public abstract class PlayerTurnAction implements Action {

	protected EventPublisher eventPublisher;
	protected Logger logger;

	public PlayerTurnAction() {
		this.eventPublisher = new ConsoleEventPublisher();
		this.logger = System.getLogger(LOGGER_NAME);
	}
	
	@Override
	public final void perform(ActionContext context) throws PlayerActionException {
		Game game = context.getGame();
		Player playerWithTurn = game.getPlayerWithTurn();
		Player sourcePlayer = context.getSourcePlayer();

		if (!playerWithTurn.equals(sourcePlayer)) {
			throw new PlayerActionException(sourcePlayer, "EXCEPTION_ALLOWED_ACTION_ONLY_ON_TURN");
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