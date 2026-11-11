package com.dainws.games.crm.domain.core.effect;

import com.dainws.games.crm.domain.core.exception.EffectException;

// TODO Post-MVP (SPELL-1): the variety of effects will make this contract grow
public interface Effect {
	EffectId getId();

	void perform(EffectContext context) throws EffectException;
}
