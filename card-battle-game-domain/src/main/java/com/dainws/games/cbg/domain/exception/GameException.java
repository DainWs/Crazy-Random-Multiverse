package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.text.Translatable;

public class GameException extends Exception implements Translatable {

	private static final long serialVersionUID = -2063427620165885793L;

	private String messageKey;
	
	public GameException(String messageKey) {
		this.messageKey = messageKey;
	}
	
	public GameException(String messageKey, String message) {
		super(message);
		this.messageKey = messageKey;
	}
	
	public GameException(String messageKey, Throwable throwable) {
		super(throwable);
		this.messageKey = messageKey;
	}
	
	public GameException(String messageKey, String message, Throwable throwable) {
		super(message, throwable);
		this.messageKey = messageKey;
	}

	@Override
	public String getKey() {
		return this.messageKey;
	}
}
