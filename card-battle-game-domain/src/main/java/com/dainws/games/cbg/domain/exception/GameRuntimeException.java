package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.communication.Error;
import com.dainws.games.cbg.domain.translator.Language;
import com.dainws.games.cbg.domain.translator.Text;
import com.dainws.games.cbg.domain.translator.Translatable;
import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class GameRuntimeException extends RuntimeException implements Translatable {

	private static final long serialVersionUID = -8674843047120348147L;

	private TranslatableKey messageKey;

	public GameRuntimeException(TranslatableKey messageKey) {
		this.messageKey = messageKey;
	}

	public GameRuntimeException(TranslatableKey messageKey, String message) {
		super(message);
		this.messageKey = messageKey;
	}

	public GameRuntimeException(TranslatableKey messageKey, Throwable throwable) {
		super(throwable);
		this.messageKey = messageKey;
	}

	public GameRuntimeException(TranslatableKey messageKey, String message, Throwable throwable) {
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

	@Override
	public Language getLanguage() {
		return Language.UNKNOWN_LANGUAGE;
	}

	public Error toError() {
		return new Error(new Text(this.messageKey));
	}
}
