package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.translator.TranslatableKey;

public class EffectException extends GameException {

	private static final long serialVersionUID = 6346367527367082604L;

	public EffectException(String messageKey) {
		super(new TranslatableKey(messageKey));
	}
	
	public EffectException(String messageKey, String message) {
		super(new TranslatableKey(messageKey), message);
	}
	
	public EffectException(String messageKey, Throwable throwable) {
		super(new TranslatableKey(messageKey), throwable);
	}
}
