package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.text.TextKey;

public class CardNotFoundException extends GameException {

	private static final long serialVersionUID = -4965456588150176332L;
	
	public CardNotFoundException(String messageKey, String message) {
		super(new TextKey(messageKey), message);
	}

}
