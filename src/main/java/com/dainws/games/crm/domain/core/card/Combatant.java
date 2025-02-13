package com.dainws.games.crm.domain.core.card;

import com.dainws.games.crm.domain.core.card.statistics.Armor;
import com.dainws.games.crm.domain.core.card.statistics.Damage;
import com.dainws.games.crm.domain.core.card.statistics.Health;

public abstract class Combatant extends Card {
	protected Damage damage;
	protected Armor armor;
	protected Health health;
	protected Equipment equipment;
	protected Skill skill;
	
	protected int attackCount;
	protected int maxAttackCount;
	protected Cooldown attackCooldown;

	protected Combatant(long code) {
		super(code);
		this.damage = Damage.NONE;
		this.armor = Armor.NONE;
		this.health = Health.NONE;
		this.skill = Skill.NONE;
		this.attackCount = 0;
		this.maxAttackCount = 1;
		this.attackCooldown = new Cooldown(1);
	}
	
	public void update() {
		if (!this.canAttack() && this.attackCooldown != null) {
			this.updateAttackCooldown();
		}
		
		if (this.equipment != null) {
			this.equipment.update();
		}
		
		if (this.hasSkill()) {
			this.skill.update();
		}
	}
	
	private void updateAttackCooldown() {
		this.attackCooldown.update();

		if (this.attackCooldown.isReady()) {
			this.attackCount = 0;
		}
	}

	public boolean canAttack() {
		return this.attackCount < this.maxAttackCount;
	}
	
	public void receiveDamageFrom(Combatant combatant) {
		Damage damage = combatant.getDamage();
		if (this.armor.canProtectAgainst(damage)) {
			this.armor = this.armor.getRemainingArmorAgainst(damage);
		} else {
			this.health = this.health.getRemainingHealthAgainst(damage);
		}
		
		combatant.increaseAttackCount();
	}
	
	private void increaseAttackCount() {
		this.attackCount++;
		
		if (this.attackCount >= this.maxAttackCount) {
			this.attackCooldown.activate();
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

	public boolean hasSkill() {
		return this.skill.isPresent();
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
	
	public Skill getSkill() {
		return skill;
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
