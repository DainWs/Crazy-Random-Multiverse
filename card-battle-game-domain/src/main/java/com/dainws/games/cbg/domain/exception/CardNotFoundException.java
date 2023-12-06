package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class CardNotFoundException extends GameException {

	private static final long serialVersionUID = -4965456588150176332L;
	
	public CardNotFoundException(String messageKey, String message) {
		super(new TranslatableKey(messageKey), message);
	}

}
