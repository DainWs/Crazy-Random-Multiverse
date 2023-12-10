package com.dainws.games.cbg.domain.card;

import java.util.Objects;

public class Equipment extends Card {
	private double damage;
	private double armor;
	private double health;

	private Equipment(Builder builder) {
		super(builder.code, builder.name, builder.description);
		this.damage = builder.damage;
		this.armor = builder.armor;
		this.health = builder.health;
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

	@Override
	public String toString() {
		return "%s[DMG=%s,ARM=%s,HP=%s]".formatted(this.getName(), this.damage, this.armor, this.health);
	}

	public static Builder builder() {
		return new Builder();
	}

	public static class Builder {
		private Long code;
		private String name;
		private String description;
		private double damage;
		private double armor;
		private double health;

		private Builder() {
		}

		public Builder withCode(long code) {
			this.code = code;
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
			Objects.requireNonNull(this.name);
			Objects.requireNonNull(this.description);
			return new Equipment(this);
		}
	}
}
