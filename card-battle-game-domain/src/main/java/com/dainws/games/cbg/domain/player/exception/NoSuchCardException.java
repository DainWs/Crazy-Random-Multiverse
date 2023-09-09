package com.dainws.games.cbg.domain.player.exception;

import com.dainws.games.cbg.domain.exception.GameRuntimeException;

public class NoSuchCardException extends GameRuntimeException {

	private static final long serialVersionUID = -5917501181970296287L;

	public NoSuchCardException(String message) {
		super(message);
	}
}
