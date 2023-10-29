package com.dainws.games.cbg.domain.effect;

import com.dainws.games.cbg.domain.exception.EffectException;

public interface Effect {
	EffectId getId();

	void perform() throws EffectException;
}
