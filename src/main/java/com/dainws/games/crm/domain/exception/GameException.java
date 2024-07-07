package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.error.Error;
import com.dainws.games.crm.domain.translator.Language;
import com.dainws.games.crm.domain.translator.Text;
import com.dainws.games.crm.domain.translator.Translatable;
import com.dainws.games.crm.domain.translator.TranslatableKey;

public class GameException extends Exception implements Translatable {

	private static final long serialVersionUID = -2063427620165885793L;

	private TranslatableKey messageKey;

	public GameException(Translatable translatable) {
		this.messageKey = translatable.getKey();
	}
	
	public GameException(Translatable translatable, Throwable throwable) {
		super(throwable);
		this.messageKey = translatable.getKey();
	}
	
	public GameException(TranslatableKey messageKey) {
		this.messageKey = messageKey;
	}

	public GameException(TranslatableKey messageKey, String message) {
		super(message);
		this.messageKey = messageKey;
	}

	public GameException(TranslatableKey messageKey, Throwable throwable) {
		super(throwable);
		this.messageKey = messageKey;
	}

	public GameException(TranslatableKey messageKey, String message, Throwable throwable) {
		super(message, throwable);
		this.messageKey = messageKey;
	}

	@Override
	public TranslatableKey getKey() {
		return this.messageKey;
	}
	
	@Override
	public String getValue() {
		return this.getMessage();
	}

	public Error toError() {
		return new Error(new Text(this.messageKey));
	}
}
