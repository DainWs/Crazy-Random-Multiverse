package com.dainws.games.crm.domain.core.exception;

public class PlayerActionExceptionCode extends GameExceptionCode {

	public PlayerActionExceptionCode(String value) {
		super("player-action." + value);
	}

}
