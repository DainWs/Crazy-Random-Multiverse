package com.dainws.games.cbg.domain;

import com.dainws.games.cbg.domain.exception.EffectException;

// TODO esto va a crecer, mucho
public interface Effect {
	EffectId getId();

	void perform() throws EffectException;
}
