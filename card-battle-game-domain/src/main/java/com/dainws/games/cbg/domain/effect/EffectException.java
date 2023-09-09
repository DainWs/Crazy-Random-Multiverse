package com.dainws.games.cbg.domain.effect;

import com.dainws.games.cbg.domain.exception.GameRuntimeException;

public class EffectException extends GameRuntimeException {

	private static final long serialVersionUID = 6346367527367082604L;

	public EffectException(String message) {
		super(message);
	}

	public EffectException(Throwable throwable) {
		super(throwable);
	}

	public EffectException(String message, Throwable throwable) {
		super(message, throwable);
	}
}
