package com.dainws.games.cbg.domain.statistics;

public enum ArmorType {
	PHYSICAL(DamageType.PHYSICAL), 
	MAGIC(DamageType.MAGIC);

	private DamageType rejectedDamageType;

	private ArmorType(DamageType rejectedDamageType) {
		this.rejectedDamageType = rejectedDamageType;
	}

	public boolean canProtectAgainst(DamageType damageType) {
		return this.rejectedDamageType.equals(damageType);
	}
}