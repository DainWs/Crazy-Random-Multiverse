package com.dainws.games.cbg.domain;

import com.dainws.games.cbg.domain.exception.EffectException;

public interface Effect {
	EffectId getId();

	void perform() throws EffectException;
}
