package com.dainws.games.crm.domain.core.card;

import java.util.Objects;

import com.dainws.games.crm.domain.core.effect.EffectId;

public class Spell extends Card {
	private EffectId effectId;
	// TODO spell cards should have an agressive or defensive approach property
	// to describe purpose

	private Spell(long id, EffectId effectId) {
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

	public static Spell newInstance(long id, long effectId) {
		return new Spell(id, EffectId.from(effectId));
	}
	
	public static Spell newInstance(long id, EffectId effectId) {
		Objects.requireNonNull(effectId);
		return new Spell(id, effectId);
	}
}
