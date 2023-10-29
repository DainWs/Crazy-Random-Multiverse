package com.dainws.games.cbg.domain.exception;

public class EffectException extends GameException {

	private static final long serialVersionUID = 6346367527367082604L;

	public EffectException(String messageKey) {
		super(messageKey);
	}
	
	public EffectException(String messageKey, String message) {
		super(messageKey, message);
	}
	
	public EffectException(String messageKey, Throwable throwable) {
		super(messageKey, throwable);
	}
}
