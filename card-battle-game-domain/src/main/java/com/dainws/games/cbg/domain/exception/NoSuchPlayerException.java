package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.text.TextKey;

public class NoSuchPlayerException extends GameRuntimeException {

	private static final long serialVersionUID = 3566265867557100109L;

	public NoSuchPlayerException(String messageKey) {
		super(new TextKey(messageKey));
	}
	
	public NoSuchPlayerException(TextKey messageKey) {
		super(messageKey);
	}
}
