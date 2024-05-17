package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.translator.TranslatableKey;

public class GameNotFoundException extends GameRuntimeException {

	private static final long serialVersionUID = -7992954174581338822L;

	public GameNotFoundException() {
		super(new TranslatableKey("EXCEPTION_GAME_NOT_FOUND"));
	}
}
