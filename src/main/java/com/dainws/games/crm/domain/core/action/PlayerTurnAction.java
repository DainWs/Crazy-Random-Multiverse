package com.dainws.games.crm.domain.core.action;

import java.lang.System.Logger;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.player.Player;
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
		EventDetails eventDetails = this.createEventDetailsFrom(context);
		this.eventPublisher.publish(new Event(eventCode, eventDetails));
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
