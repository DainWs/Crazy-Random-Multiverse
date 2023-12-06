package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.text.TextKey;

public class EffectException extends GameException {

	private static final long serialVersionUID = 6346367527367082604L;

	public EffectException(String messageKey) {
		super(new TextKey(messageKey));
	}
	
	public EffectException(String messageKey, String message) {
		super(new TextKey(messageKey), message);
	}
	
	public EffectException(String messageKey, Throwable throwable) {
		super(new TextKey(messageKey), throwable);
	}
}
