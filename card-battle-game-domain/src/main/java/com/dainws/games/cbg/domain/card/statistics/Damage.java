package com.dainws.games.cbg.domain.card.statistics;

public class Damage extends Statistic {
	private static final double INFINITE_DAMAGE_VALUE = Double.POSITIVE_INFINITY;

	public static final Damage NONE = new Damage(0, DamageType.PHYSICAL);
	public static final Damage INFINITE = new Damage(INFINITE_DAMAGE_VALUE, DamageType.TRUE);

	private DamageType type;
	
	private Damage(double baseValue, DamageType type) {
		super(baseValue);
		this.type = type;
	}

	public boolean isType(DamageType type) {
		return this.type.equals(type);
	}
	
	public boolean isInfinite() {
		return this.value == INFINITE_DAMAGE_VALUE;
	}

	public DamageType getType() {
		return type;
	}
	
	@Override
	public String toString() {
		if (this.equals(INFINITE)) {
			return "INFINITE";
		}

		return "%s %s".formatted(this.type, this.value);
	}
	
	public static Damage newInstance(double baseValue, DamageType type) {
		if (baseValue <= 0) {
			return NONE;
		}
		
		return new Damage(baseValue, type);
	}
}
