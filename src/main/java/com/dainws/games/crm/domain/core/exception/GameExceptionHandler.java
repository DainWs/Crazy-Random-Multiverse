package com.dainws.games.crm.domain.core.exception;

public interface GameExceptionHandler {
	static final GameExceptionHandler NONE = new GameExceptionHandler() {};

	default void handle(String exceptionCode) {
		this.handle(new GameExceptionCode(exceptionCode));
	};
	
	default void handle(GameExceptionCode exceptionCode) {};
	
	default void handle(GameException exception) {};

	default void handle(GameRuntimeException exception) {};
}
