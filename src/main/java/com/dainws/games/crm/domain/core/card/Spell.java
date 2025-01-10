package com.dainws.games.crm.domain.core.card;

import java.util.Objects;

import com.dainws.games.crm.domain.core.effect.EffectId;

public class Spell extends Card {
	private EffectId effectId;

	private Spell(Long id, EffectId effectId) {
		super(id);
		this.effectId = effectId;
	}

	@Override
	public CardType getType() {
		return CardType.SPELL;
	}

	public EffectId getEffectId() {
		return this.effectId;
	}

	public static Spell newIntance(Long id, Long effectId) {
		Objects.requireNonNull(id);
		Objects.requireNonNull(effectId);
		return new Spell(id, EffectId.from(effectId));
	}
	
	public static Spell newIntance(Long id, EffectId effectId) {
		Objects.requireNonNull(id);
		Objects.requireNonNull(effectId);
		return new Spell(id, effectId);
	}
}
