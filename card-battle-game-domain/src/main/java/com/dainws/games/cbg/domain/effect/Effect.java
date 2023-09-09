package com.dainws.games.cbg.domain.effect;

public interface Effect {
	EffectId getId();

	void perform() throws EffectException;
}
