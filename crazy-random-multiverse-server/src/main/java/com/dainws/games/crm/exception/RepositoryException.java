package com.dainws.games.crm.exception;

import com.dainws.games.cbg.domain.translator.Language;
import com.dainws.games.cbg.domain.translator.Translatable;
import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class RepositoryException extends RuntimeException implements Translatable {

	private static final long serialVersionUID = 4084499588391294772L;

	private TranslatableKey messageKey;

	public RepositoryException(TranslatableKey messageKey) {
		super();
		this.messageKey = messageKey;
	}

	public RepositoryException(TranslatableKey messageKey, String message) {
		super(message);
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

}
