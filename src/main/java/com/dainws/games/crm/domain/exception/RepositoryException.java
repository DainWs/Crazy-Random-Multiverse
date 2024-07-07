package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.translator.Language;
import com.dainws.games.crm.domain.translator.Translatable;
import com.dainws.games.crm.domain.translator.TranslatableKey;

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

}
