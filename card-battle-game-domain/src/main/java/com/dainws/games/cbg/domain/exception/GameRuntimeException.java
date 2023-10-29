package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.text.Translatable;

public class GameRuntimeException extends RuntimeException implements Translatable {

	private static final long serialVersionUID = -8674843047120348147L;

	private String messageKey;
	
	public GameRuntimeException(String messageKey) {
		this.messageKey = messageKey;
	}
	
	public GameRuntimeException(String messageKey, String message) {
		super(message);
		this.messageKey = messageKey;
	}
	
	public GameRuntimeException(String messageKey, Throwable throwable) {
		super(throwable);
		this.messageKey = messageKey;
	}
	
	public GameRuntimeException(String messageKey, String message, Throwable throwable) {
		super(message, throwable);
		this.messageKey = messageKey;
	}

	@Override
	public String getKey() {
		return this.messageKey;
	}
}
