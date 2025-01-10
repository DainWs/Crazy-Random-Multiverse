package com.dainws.games.crm.domain.core.card;

import java.util.Objects;

public class Equipment extends Card {
	private double damage;
	private double armor;
	private double health;
	private Skill skill;

	private Equipment(Builder builder) {
		super(builder.code);
		this.damage = builder.damage;
		this.armor = builder.armor;
		this.health = builder.health;
		this.skill = builder.skill;
	}

	@Override
	public CardType getType() {
		return CardType.EQUIPMENT;
	}

	public double getDamageValue() {
		return damage;
	}

	public double getArmorValue() {
		return armor;
	}

	public double getHealthValue() {
		return health;
	}
	
	public boolean hasSkill() {
		return this.skill.isPresent();
	}
	
	public Skill getSkill() {
		return skill;
	}

	@Override
	public String toString() {
		String cardAsString = super.toString();
		return "%s[DMG=%s,ARM=%s,HP=%s]".formatted(cardAsString, this.damage, this.armor, this.health);
	}

	public static Builder builder() {
		return new Builder();
	}

	public static class Builder {
		private Long code;
		private double damage;
		private double armor;
		private double health;
		private Skill skill;

		private Builder() {
			this.skill = Skill.NONE;
		}

		public Builder withCode(long code) {
			this.code = code;
			return this;
		}
		
		public Builder withSkill(Skill skill) {
			if (skill != null) {
				this.skill = skill;
			}
			return this;
		}

		public Builder withDamage(double damage) {
			this.damage = damage;
			return this;
		}

		public Builder withDamageBuff(double amount) {
			this.checkStatAmount(amount);

			this.damage = amount;
			return this;
		}

		public Builder withDamageDebuff(double amount) {
			this.checkStatAmount(amount);

			this.damage = -amount;
			return this;
		}

		public Builder withArmor(double armor) {
			this.armor = armor;
			return this;
		}

		public Builder withArmorBuff(double amount) {
			this.checkStatAmount(amount);

			this.armor = amount;
			return this;
		}

		public Builder withArmorDebuff(double amount) {
			this.checkStatAmount(amount);

			this.armor = -amount;
			return this;
		}

		public Builder withHealth(double health) {
			this.health = health;
			return this;
		}

		public Builder withHealthBuff(double amount) {
			this.checkStatAmount(amount);

			this.health = amount;
			return this;
		}

		public Builder withHealthDebuff(double amount) {
			this.checkStatAmount(amount);

			this.health = -amount;
			return this;
		}

		private void checkStatAmount(double amount) {
			if (amount < 0) {
				throw new IllegalArgumentException("Amount cant be less than 0");
			}
		}

		public Equipment build() {
			Objects.requireNonNull(this.code);
			return new Equipment(this);
		}
	}
}
