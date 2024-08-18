package com.dainws.games.crm.domain.core.effect;

import com.dainws.games.crm.domain.exception.EffectException;

// TODO esto va a crecer mucho debido a la variedad y posibilidades de los effectos
public interface Effect {
	EffectId getId();

	void perform(EffectContext context) throws EffectException;
}
