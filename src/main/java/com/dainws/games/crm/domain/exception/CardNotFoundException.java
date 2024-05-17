package com.dainws.games.crm.domain.exception;

import com.dainws.games.crm.domain.translator.Translatable;
import com.dainws.games.crm.domain.translator.TranslatableKey;

public class CardNotFoundException extends GameRuntimeException implements Translatable {

	private static final long serialVersionUID = 1392950877789673225L;

	public CardNotFoundException() {
		super(new TranslatableKey("EXCEPTION_CARD_NOT_FOUND"));
	}
}
