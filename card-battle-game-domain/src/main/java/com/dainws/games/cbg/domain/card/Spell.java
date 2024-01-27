package com.dainws.games.cbg.domain.card;

import java.util.Objects;

import com.dainws.games.cbg.domain.effect.Effect;
import com.dainws.games.cbg.domain.effect.EffectId;

public class Spell extends Card {
	private EffectId effectId;

	private Spell(Builder builder) {
		super(builder.id, builder.name, builder.description);
		this.effectId = builder.effectId;
	}

	@Override
	public CardType getType() {
		return CardType.SPELL;
	}

	public EffectId getEffectId() {
		return this.effectId;
	}

	public static Builder builder() {
		return new Builder();
	}

	public static class Builder {
		private Long id;
		private EffectId effectId;
		private String name;
		private String description;

		private Builder() {
		}

		public Builder withCode(long id) {
			this.id = id;
			return this;
		}

		public Builder withName(String name) {
			this.name = name;
			return this;
		}

		public Builder withDescription(String description) {
			this.description = description;
			return this;
		}

		public Builder withEffect(long effectId) {
			this.effectId = new EffectId(effectId);
			return this;
		}

		public Builder withEffect(EffectId effectId) {
			this.effectId = effectId;
			return this;
		}

		public Builder withEffect(Effect effect) {
			this.effectId = effect.getId();
			return this;
		}

		public Spell build() {
			Objects.requireNonNull(this.id);
			Objects.requireNonNull(this.effectId);
			Objects.requireNonNull(this.name);
			Objects.requireNonNull(this.description);
			return new Spell(this);
		}
	}
}
