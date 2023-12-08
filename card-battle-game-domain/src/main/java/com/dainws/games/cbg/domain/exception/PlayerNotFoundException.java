package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class PlayerNotFoundException extends GameRuntimeException {

	private static final long serialVersionUID = 3566265867557100109L;

	public PlayerNotFoundException() {
		super(new TranslatableKey("EXCEPTION_PLAYER_NOT_FOUND"));
	}
}
