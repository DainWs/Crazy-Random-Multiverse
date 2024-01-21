package com.dainws.games.cbg.domain.exception;

import com.dainws.games.cbg.domain.translator.TranslatableKey;

public class EmptyDeckException extends GameRuntimeException {

	private static final long serialVersionUID = -9006209164621867019L;

	public EmptyDeckException() {
		super(new TranslatableKey("The deck requires at least 1 card"));
	}
}
