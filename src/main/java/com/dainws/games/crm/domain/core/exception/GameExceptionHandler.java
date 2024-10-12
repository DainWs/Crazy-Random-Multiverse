package com.dainws.games.crm.domain.core.exception;

public interface GameExceptionHandler {
	static final GameExceptionHandler NONE = new GameExceptionHandler() {};
	
	default void handle(GameException exception) {};

	default void handle(GameRuntimeException exception) {};
}
