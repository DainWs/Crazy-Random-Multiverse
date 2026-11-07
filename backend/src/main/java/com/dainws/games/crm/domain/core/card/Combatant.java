package com.dainws.games.crm.domain.core.card;

import java.util.ArrayList;
import java.util.List;
import java.util.function.ToDoubleFunction;
import java.util.stream.Collectors;

import com.dainws.games.crm.domain.core.card.statistics.Armor;
import com.dainws.games.crm.domain.core.card.statistics.Damage;
import com.dainws.games.crm.domain.core.card.statistics.Health;

public abstract class Combatant extends Card {
	private static final double MIN_HEALTH_WITH_EQUIPMENT = 1;

	protected Damage damage;
	protected Armor armor;
	protected Health health;
	protected List<Equipment> equipment;
	private Damage baseDamage;
	private Armor baseArmor;
	private Health baseHealth;
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
		this.equipment = new ArrayList<>();
		this.attackCount = 0;
		this.maxAttackCount = 1;
		this.attackCooldown = new Cooldown(1);
	}
	
	public void update() {
		if (!this.canAttack() && this.attackCooldown != null) {
			this.updateAttackCooldown();
		}
		
		for (Equipment piece : this.equipment) {
			piece.update();
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
	
	public AttackResult receiveDamageFrom(Combatant combatant) {
		double armorBefore = this.armor.getValue();
		double healthBefore = this.health.getValue();

		Damage damage = combatant.getDamage();
		if (this.armor.canProtectAgainst(damage)) {
			this.armor = this.armor.getRemainingArmorAgainst(damage);
		} else {
			this.health = this.health.getRemainingHealthAgainst(damage);
		}
		
		combatant.increaseAttackCount();

		double armorDamage = armorBefore - this.armor.getValue();
		double healthDamage = healthBefore - this.health.getValue();
		return new AttackResult(armorDamage, healthDamage, !this.isAlive());
	}
	
	public void startPlacementCooldown() {
		this.attackCount = this.maxAttackCount;
		this.attackCooldown.activate();
	}

	private void increaseAttackCount() {
		this.attackCount++;
		
		if (this.attackCount >= this.maxAttackCount) {
			this.attackCooldown.activate();
		}
	}

	/** The effects of all the pieces add up and the limits apply to the total (EQUIP-4, EQUIP-5). */
	public void equip(Equipment piece) {
		if (this.equipment.isEmpty()) {
			this.baseDamage = this.damage;
			this.baseArmor = this.armor;
			this.baseHealth = this.health;
		}

		double armorLost = this.getMaxArmorValue() - this.armor.getValue();
		double healthLost = this.health.getMaxValue() - this.health.getValue();

		this.equipment.add(piece);
		this.updateDamage();
		this.updateArmor(armorLost);
		this.updateHealth(healthLost);
	}

	private void updateDamage() {
		if (!this.damage.isInfinite()) {
			double damageValue = this.baseDamage.getValue() + this.sumOfPieces(Equipment::getDamageValue);
			this.damage = Damage.newInstance(damageValue, this.baseDamage.getType());
		}
	}

	private void updateArmor(double armorLost) {
		this.armor = Armor.newInstance(this.getMaxArmorValue() - armorLost, this.baseArmor.getType());
	}

	private void updateHealth(double healthLost) {
		if (!this.health.isInfinite()) {
			double maxValue = Math.max(MIN_HEALTH_WITH_EQUIPMENT, this.baseHealth.getMaxValue() + this.sumOfPieces(Equipment::getHealthValue));
			double value = Math.max(MIN_HEALTH_WITH_EQUIPMENT, maxValue - healthLost);
			this.health = Health.newInstance(value, maxValue);
		}
	}

	private double getMaxArmorValue() {
		if (this.equipment.isEmpty()) {
			return this.armor.getValue();
		}

		return Math.max(0, this.baseArmor.getValue() + this.sumOfPieces(Equipment::getArmorValue));
	}

	private double sumOfPieces(ToDoubleFunction<Equipment> effect) {
		return this.equipment.stream().mapToDouble(effect).sum();
	}

	public boolean isAlive() {
		return !this.health.isZero();
	}

	public boolean hasSkill() {
		return this.skill.isPresent();
	}
	
	public List<Equipment> getEquipment() {
		return List.copyOf(this.equipment);
	}

	/** The damage without the equipment. */
	public Damage getBaseDamage() {
		if (this.equipment.isEmpty()) {
			return this.damage;
		}

		return this.baseDamage;
	}

	/** The armor without the equipment. */
	public Armor getBaseArmor() {
		if (this.equipment.isEmpty()) {
			return this.armor;
		}

		return this.baseArmor;
	}

	/** The health without the equipment. */
	public Health getBaseHealth() {
		if (this.equipment.isEmpty()) {
			return this.health;
		}

		return this.baseHealth;
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
		String equipmentName = this.equipment.stream().map(piece -> piece.getCode().toString()).collect(Collectors.joining(","));
		return "%s[DMG=%s,ARM=%s,HP=%s,EQUIPMENT=%s]"
				.formatted(cardAsString, this.damage, this.armor, this.health, equipmentName);
	}
}
