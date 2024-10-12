package com.dainws.games.crm.domain.core.card;

import com.dainws.games.crm.domain.core.card.statistics.Armor;
import com.dainws.games.crm.domain.core.card.statistics.Damage;
import com.dainws.games.crm.domain.core.card.statistics.Health;

public abstract class Combatant extends Card {
	protected Damage damage;
	protected Armor armor;
	protected Health health;
	protected Equipment equipment;

	protected Combatant(long code, String name, String description) {
		super(code, name, description);
	}

	public void receiveDamageFrom(Combatant combatant) {
		Damage damage = combatant.getDamage();
		if (this.armor.canProtectAgainst(damage)) {
			this.armor = this.armor.getRemainingArmorAgainst(damage);
		} else {
			this.health = this.health.getRemainingHealthAgainst(damage);
		}
	}

	public void equip(Equipment equipment) {
		this.unequip();
		this.updateDamageWith(equipment.getDamageValue());
		this.updateArmorWith(equipment.getArmorValue());
		this.updateHealthWith(equipment.getHealthValue(), equipment.getHealthValue());
		this.equipment = equipment;
	}

	public void unequip() {
		if (this.equipment != null) {
			this.updateDamageWith(-this.equipment.getDamageValue());
			this.updateArmorWith(-this.equipment.getArmorValue());
			this.updateHealthWith(0, -this.equipment.getHealthValue());
		}
	}

	private void updateDamageWith(double value) {
		if (!this.damage.isInfinite()) {
			double damageValue = this.damage.getValue() + value;
			this.damage = Damage.newInstance(damageValue, this.damage.getType());
		}
	}

	private void updateArmorWith(double value) {
		double armorValue = this.armor.getValue() + value;
		this.armor = Armor.newInstance(armorValue, this.armor.getType());
	}

	private void updateHealthWith(double value, double maxValue) {
		if (!this.health.isInfinite()) {
			double healthValue = this.health.getValue() + value;
			double maxHealthValue = this.health.getMaxValue() + maxValue;
			this.health = Health.newInstance(healthValue, maxHealthValue);
		}
	}

	public boolean isAlive() {
		return !this.health.isZero();
	}

	public Equipment getEquipment() {
		return this.equipment;
	}

	public Damage getDamage() {
		return this.damage;
	}

	public Health getHealth() {
		return this.health;
	}

	public Armor getArmor() {
		return this.armor;
	}

	@Override
	public String toString() {
		String cardAsString = super.toString();
		String equipmentName = "";
		if (this.equipment != null) {
			equipmentName = this.equipment.getCode().toString();
		}
		return "%s[DMG=%s,ARM=%s,HP=%s,EQUIPMENT=%s]"
				.formatted(cardAsString, this.damage, this.armor, this.health, equipmentName);
	}
}
