package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.translator.Translatable;
import com.dainws.games.crm.domain.translator.TranslatableKey;

public class PartyException extends RuntimeException implements Translatable {

	private static final long serialVersionUID = -5952425827950206049L;

	private TranslatableKey messageKey;

	public PartyException(String messageKey) {
		this(new TranslatableKey(messageKey));
	}
	
	public PartyException(TranslatableKey messageKey) {
		super();
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
