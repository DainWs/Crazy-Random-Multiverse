package com.dainws.games.crm.domain.core.exception;

import com.dainws.games.crm.domain.core.effect.Effect;

public class EffectException extends GameException {

	private static final long serialVersionUID = 6346367527367082604L;

	private Effect effect;

	public EffectException(EffectExceptionCode code, Effect effect) {
		super(code);
		this.effect = effect;
	}

	public EffectException(EffectExceptionCode code, Effect effect, Throwable throwable) {
		super(code, throwable);
		this.effect = effect;
	}

	public Effect getEffect() {
		return effect;
	}
}
