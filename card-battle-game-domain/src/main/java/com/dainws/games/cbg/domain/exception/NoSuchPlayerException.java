package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class NoSuchPlayerException extends GameRuntimeException {

	private static final long serialVersionUID = 3566265867557100109L;

	public NoSuchPlayerException(String messageKey) {
		super(new TranslatableKey(messageKey));
	}
	
	public NoSuchPlayerException(TranslatableKey messageKey) {
		super(messageKey);
	}
}
