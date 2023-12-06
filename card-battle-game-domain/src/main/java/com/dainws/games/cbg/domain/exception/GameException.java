package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.text.TextKey;
import com.dainws.games.cbg.domain.text.TextLanguage;
import com.dainws.games.cbg.domain.text.Translatable;

public class GameException extends Exception implements Translatable {

	private static final long serialVersionUID = -2063427620165885793L;

	private TextKey messageKey;
	
	public GameException(TextKey messageKey) {
		this.messageKey = messageKey;
	}
	
	public GameException(TextKey messageKey, String message) {
		super(message);
		this.messageKey = messageKey;
	}
	
	public GameException(TextKey messageKey, Throwable throwable) {
		super(throwable);
		this.messageKey = messageKey;
	}
	
	public GameException(TextKey messageKey, String message, Throwable throwable) {
		super(message, throwable);
		this.messageKey = messageKey;
	}

	@Override
	public TextKey getKey() {
		return this.messageKey;
	}

	@Override
	public TextLanguage getLanguage() {
		return TextLanguage.UNKNOWN_LANGUAGE;
	}
}
