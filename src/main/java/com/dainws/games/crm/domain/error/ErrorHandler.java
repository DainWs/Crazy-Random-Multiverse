package com.dainws.games.crm.domain.error;

import java.util.List;

import com.dainws.games.crm.domain.core.exception.GameException;
import com.dainws.games.crm.domain.core.exception.GameExceptionHandler;
import com.dainws.games.crm.domain.core.exception.GameRuntimeException;
import com.dainws.games.crm.domain.core.exception.PlayerActionException;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.domain.translator.Text;

public class ErrorHandler implements GameExceptionHandler {
	private ErrorChannel errorChannel;

	public ErrorHandler() {
		this.errorChannel = new ConsoleErrorChannel();
	}

	public ErrorHandler(ErrorChannel errorChannel) {
		this.errorChannel = errorChannel;
	}
	
	@Override
	public void handle(GameException exception) {
		if (exception instanceof PlayerActionException actionException) {
			this.notifyErrorToPlayer(actionException.getSource(), this.toError(actionException));
		}

		GameExceptionHandler.super.handle(exception);
	}

	public void notifyErrorToPlayers(List<Player> players, GameException exception) {
		for (Player player : players) {
			this.notifyErrorToPlayer(player, this.toError(exception));
		}
	}

	public void notifyErrorToPlayers(List<Player> players, GameRuntimeException exception) {
		for (Player player : players) {
			this.notifyErrorToPlayer(player, this.toError(exception));
		}
	}

	public void notifyErrorToPlayers(List<Player> players, Error error) {
		for (Player player : players) {
			this.notifyErrorToPlayer(player, error);
		}
	}

	public void notifyErrorToPlayer(Player player, GameException exception) {
		this.notifyErrorToPlayer(player, this.toError(exception));
	}

	public void notifyErrorToPlayer(Player player, GameRuntimeException exception) {
		this.notifyErrorToPlayer(player, this.toError(exception));
	}

	public void notifyErrorToPlayer(Player player, Error error) {
		this.errorChannel.send(player, error);
	}

	private Error toError(GameException exception) {
		return new Error(new Text(exception.getCodeValue()));
	}

	private Error toError(GameRuntimeException exception) {
		return new Error(new Text(exception.getCodeValue()));
	}
}
