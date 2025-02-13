package com.dainws.games.crm.domain.core.action;

import java.util.logging.Level;
import java.util.logging.Logger;

import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.exception.ExceptionCode;
import com.dainws.games.crm.domain.core.exception.GameRuntimeException;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.core.player.PlayerCode;

public abstract class PlayerTurnAction implements Action {

	protected final Logger logger;
	private String track;

	protected PlayerTurnAction() {
		this.track = "[NONE TRACK]";
		this.logger = Logger.getLogger(LOGGER_NAME);
	}

	@Override
	public final boolean perform(ActionContext context) {
		this.prepareTrack(context);

		if (!this.sourcePlayerHasTurn(context)) {
			this.notifyThatSourcePlayerRequiresTurn(context);
			return false;
		}

		try {
			return this.performPlayerAction(context);
		} catch (GameRuntimeException exception) {
			this.publishException(exception.getCode(), context);
		} catch (GameException exception) {
			this.publishException(exception.getCode(), context);
		}

		return false;
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

	private void notifyThatSourcePlayerRequiresTurn(ActionContext context) {
		String codeAsText = "exception.player-action.allowed_only_on_turn";
		ExceptionCode exceptionCode = new ExceptionCode(codeAsText);
		this.publishException(exceptionCode, context);
	}

	protected abstract boolean performPlayerAction(ActionContext context) throws PlayerActionException, GameException;

	protected final void logTrace(String format, Object... arguments) {
		if (this.logger.isLoggable(Level.FINEST)) {
			String formatWithTrack = this.track + " " + format;
			this.logger.log(Level.FINEST, formatWithTrack, arguments);
		}
	}

	protected final void publishException(ExceptionCode exceptionCode, ActionContext context) {
		Game game = context.getGame();
		game.publishException(context.getSourcePlayer(), exceptionCode);
	}

	protected final void notifyActionEvent(EventCode eventCode, ActionContext context) {
		EventDetails eventDetails = this.createEventDetailsFrom(context);

		Game game = context.getGame();
		game.publishEvent(eventCode, eventDetails);
	}

	private EventDetails createEventDetailsFrom(ActionContext context) {
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
