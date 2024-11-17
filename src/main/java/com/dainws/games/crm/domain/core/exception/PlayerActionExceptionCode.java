package com.dainws.games.crm.domain.core.exception;

public class PlayerActionExceptionCode extends ExceptionCode {

	public PlayerActionExceptionCode(String value) {
		super("player-action." + value);
	}

}
