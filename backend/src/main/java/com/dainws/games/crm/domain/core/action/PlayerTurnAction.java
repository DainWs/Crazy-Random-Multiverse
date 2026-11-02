package com.dainws.games.crm.domain.core.action;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode;
import com.dainws.games.crm.domain.core.exception.PlayerActionExceptionCode.Code;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public abstract class PlayerTurnAction implements Action {

	private static final Logger LOGGER = LoggerFactory.getLogger(Action.class);

	private String track;

	protected PlayerTurnAction() {
		this.track = "[NONE TRACK]";
	}

	@Override
	public final ActionResult perform(ActionContext context) {
		this.prepareTrack(context);

		if (!this.sourcePlayerHasTurn(context)) {
			return ActionResult.failed(new PlayerActionExceptionCode(Code.ALLOWED_ONLY_ON_TURN));
		}

		return this.performPlayerAction(context);
	}

	private void prepareTrack(ActionContext context) {
		GameCode gameCode = context.getGame().getCode();
		PlayerCode playerCode = context.getSourcePlayer().getPlayerCode();
		this.track = "[game=%s,player=%s]".formatted(gameCode, playerCode);
	}

	private boolean sourcePlayerHasTurn(ActionContext context) {
		Game game = context.getGame();
		Player playerWithTurn = game.getPlayerWithTurn();
		Player sourcePlayer = context.getSourcePlayer();
		return playerWithTurn.equals(sourcePlayer);
	}

	protected abstract ActionResult performPlayerAction(ActionContext context);

	protected final void logTrace(String format, Object... arguments) {
		String formatWithTrack = this.track + " " + format;
		LOGGER.trace(formatWithTrack, arguments);
	}

	protected final void notifyActionEvent(EventCode eventCode, ActionContext context) {
		this.notifyActionEvent(eventCode, this.createEventDetailsFrom(context));
	}

	protected final void notifyActionEvent(EventCode eventCode, EventDetails eventDetails) {
		Game game = eventDetails.getGame();
		game.publishEvent(eventCode, eventDetails);
	}

	protected final EventDetails createEventDetailsFrom(ActionContext context) {
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
