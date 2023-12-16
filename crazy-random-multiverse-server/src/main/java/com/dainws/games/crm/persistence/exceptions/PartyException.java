package com.dainws.games.crm.persistence.exceptions;

import com.dainws.games.cbg.domain.translator.Language;
import com.dainws.games.cbg.domain.translator.Translatable;
import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class PartyException extends Exception implements Translatable {

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

	@Override
	public Language getLanguage() {
		return Language.UNKNOWN_LANGUAGE;
	}

}
