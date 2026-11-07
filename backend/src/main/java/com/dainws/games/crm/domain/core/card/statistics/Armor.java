package com.dainws.games.crm.domain.core.card.statistics;

public class Armor extends Statistic {
	public static final Armor NONE = new Armor(0, ArmorType.PHYSICAL);
	
	private ArmorType type;

	private Armor(double baseValue, ArmorType type) {
		super(baseValue);
		this.type = type;
	}

	public ArmorType getType() {
		return type;
	}

	public Damage getRemainingDamageAgainst(Damage damage) {
		if (!this.type.canProtectAgainst(damage.getType())) {
			return damage;
		}

		double remainingDamage = damage.getValue() - this.value;
		if (remainingDamage < 0) {
			remainingDamage = 0;
		}

		return Damage.newInstance(remainingDamage, damage.getType());
	}

	public Armor getRemainingArmorAgainst(Damage damage) {
		if (!this.type.canProtectAgainst(damage.getType())) {
			return this;
		}

		double remainingArmor = this.value - damage.getValue();
		if (remainingArmor < 0) {
			remainingArmor = 0;
		}

		return newInstance(remainingArmor, this.type);
	}
	
	public boolean canProtectAgainst(Damage damage) {
		if (damage.isInfinite()) {
			return false;
		}
		
		if (this.value <= 0) {
			return false;
		}

		return this.type.canProtectAgainst(damage.getType());
	}

	@Override
	public String toString() {
		return "%s %s".formatted(this.type, this.value);
	}
	
	/** A zero keeps its type, because equipment takes the type of the card (EQUIP-1). */
	private static Armor zero(ArmorType type) {
		if (type == NONE.type) {
			return NONE;
		}

		return new Armor(0, type);
	}

	public static Armor newInstance(double baseValue, ArmorType type) {
		if (baseValue <= 0) {
			return zero(type);
		}
		
		return new Armor(baseValue, type);
	}
}
