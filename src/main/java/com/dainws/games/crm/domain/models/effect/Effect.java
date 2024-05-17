package com.dainws.games.crm.domain.models.effect;

import com.dainws.games.crm.domain.exception.EffectException;

// TODO esto va a crecer, mucho
public interface Effect {
	EffectId getId();

	void perform() throws EffectException;
}
