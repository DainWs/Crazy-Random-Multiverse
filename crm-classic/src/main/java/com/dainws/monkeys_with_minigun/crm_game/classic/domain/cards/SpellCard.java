package com.dainws.monkeys_with_minigun.crm_game.classic.domain.cards;

import java.util.Objects;
import java.util.Optional;

import com.dainws.monkeys_with_minigun.crm_game.domain.cards.Card;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.abilities.SpecialAbility;
import com.dainws.monkeys_with_minigun.crm_game.domain.cards.abilities.SpecialAbilityCard;

public class SpellCard extends Card implements SpecialAbilityCard {

	private static final long serialVersionUID = -1742649534929011345L;

	private SpecialAbility specialAbility;
	
	private SpellCard(Builder builder) {
		super(builder.name, builder.description, ClassicCardTypes.SPELL, ClassicCardRarity.NORMAL);
		this.specialAbility = builder.specialAbility;
	}

	@Override
	public boolean hasSpecialAbility() {
		return true;
	}

	@Override
	public Optional<SpecialAbility> getSpecialAbility() {
		return Optional.of(this.specialAbility);
	}

	public static class Builder {
		private String name;
		private String description;
		private SpecialAbility specialAbility;
		
		public Builder withName(String name) {
			this.name = name;
			return this;
		}
		
		public Builder withDescription(String description) {
			this.description = description;
			return this;
		}
		
		public Builder withSpecialAbility(SpecialAbility specialAbility) {
			this.specialAbility = specialAbility;
			return this;
		}
		
		public SpellCard build() {
			Objects.requireNonNull(this.name);
			Objects.requireNonNull(this.description);
			Objects.requireNonNull(this.specialAbility);
			
			return new SpellCard(this);
		}
	}
}
