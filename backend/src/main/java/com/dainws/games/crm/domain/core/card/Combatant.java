package com.dainws.games.crm.domain.core.card;

import java.util.ArrayList;
import java.util.List;
import java.util.function.ToDoubleFunction;
import java.util.stream.DoubleStream;

import com.dainws.games.crm.domain.core.card.statistics.Armor;
import com.dainws.games.crm.domain.core.card.statistics.ArmorType;
import com.dainws.games.crm.domain.core.card.statistics.Damage;
import com.dainws.games.crm.domain.core.card.statistics.DamageType;
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

		double maxArmorValue = this.getMaxArmorValue();
		double armorLost = maxArmorValue - this.armor.getValue();
		double maxHealthValue = this.health.getMaxValue();
		double healthLost = maxHealthValue - this.health.getValue();

		this.equipment.add(piece);
		this.updateDamage();
		this.updateArmor(armorLost);
		this.updateHealth(healthLost);
	}

	private void updateDamage() {
		if (!this.damage.isInfinite()) {
			double equipmentDamage = this.sumOfPieces(Equipment::getDamageValue);
			double damageValue = this.baseDamage.getValue() + equipmentDamage;
			DamageType damageType = this.baseDamage.getType();
			this.damage = Damage.newInstance(damageValue, damageType);
		}
	}

	private void updateArmor(double armorLost) {
		double maxArmorValue = this.getMaxArmorValue();
		double armorValue = maxArmorValue - armorLost;
		ArmorType armorType = this.baseArmor.getType();
		this.armor = Armor.newInstance(armorValue, armorType);
	}

	private void updateHealth(double healthLost) {
		if (!this.health.isInfinite()) {
			double equipmentHealth = this.sumOfPieces(Equipment::getHealthValue);
			double unlimitedMaxValue = this.baseHealth.getMaxValue() + equipmentHealth;
			double maxValue = Math.max(MIN_HEALTH_WITH_EQUIPMENT, unlimitedMaxValue);
			double unlimitedValue = maxValue - healthLost;
			double value = Math.max(MIN_HEALTH_WITH_EQUIPMENT, unlimitedValue);
			this.health = Health.newInstance(value, maxValue);
		}
	}

	private double getMaxArmorValue() {
		if (this.equipment.isEmpty()) {
			return this.armor.getValue();
		}

		double equipmentArmor = this.sumOfPieces(Equipment::getArmorValue);
		double unlimitedArmor = this.baseArmor.getValue() + equipmentArmor;
		return Math.max(0, unlimitedArmor);
	}

	private double sumOfPieces(ToDoubleFunction<Equipment> effect) {
		DoubleStream effects = this.equipment.stream().mapToDouble(effect);
		return effects.sum();
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
		List<String> pieceCodes = this.equipment.stream()
				.map(piece -> piece.getCode().toString())
				.toList();
		String equipmentName = String.join(",", pieceCodes);
		return "%s[DMG=%s,ARM=%s,HP=%s,EQUIPMENT=%s]"
				.formatted(cardAsString, this.damage, this.armor, this.health, equipmentName);
	}
}
