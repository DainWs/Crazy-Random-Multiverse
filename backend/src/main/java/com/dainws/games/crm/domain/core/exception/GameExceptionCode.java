package com.dainws.games.crm.domain.core.exception;

public class GameExceptionCode extends ExceptionCode {

	public static final ExceptionCode NOT_IN_PROGRESS = new GameExceptionCode("not_in_progress");

	public GameExceptionCode(String value) {
		super("game." + value);
	}

}
