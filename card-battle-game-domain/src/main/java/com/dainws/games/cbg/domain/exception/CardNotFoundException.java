package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.translator.Translatable;
import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class CardNotFoundException extends GameRuntimeException implements Translatable {

	private static final long serialVersionUID = 1392950877789673225L;

	public CardNotFoundException() {
		super(new TranslatableKey("CARD_NOT_FOUND"));
	}
}
