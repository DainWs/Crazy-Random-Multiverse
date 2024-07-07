package com.dainws.games.crm.domain.models.card;

import java.util.Objects;

import com.dainws.games.crm.domain.models.card.statistics.Armor;
import com.dainws.games.crm.domain.models.card.statistics.ArmorType;
import com.dainws.games.crm.domain.models.card.statistics.Damage;
import com.dainws.games.crm.domain.models.card.statistics.DamageType;
import com.dainws.games.crm.domain.models.card.statistics.Health;

public class Warrior extends Combatant {

	private WarriorRarity rarity;

	protected Warrior(Builder builder) {
		super(builder.id, builder.name, builder.description);
		this.rarity = builder.rarity;
		this.damage = builder.damage;
		this.armor = builder.armor;
		this.health = builder.health;
	}

	public boolean isRarity(WarriorRarity rarity) {
		return this.rarity.equals(rarity);
	}

	@Override
	public CardType getType() {
		return CardType.WARRIOR;
	}

	public WarriorRarity getRarity() {
		return rarity;
	}

	public static Builder warriorBuilder(WarriorRarity rarity) {
		Objects.requireNonNull(rarity);
		return new Builder(rarity);
	}
	
	public static Builder commonWarriorBuilder() {
		return new Builder(WarriorRarity.COMMON);
	}

	public static Builder uncommonWarriorBuilder() {
		return new Builder(WarriorRarity.UNCOMMON);
	}

	public static Builder rareWarriorBuilder() {
		return new Builder(WarriorRarity.RARE);
	}

	public static Builder epicWarriorBuilder() {
		return new Builder(WarriorRarity.EPIC);
	}

	public static Builder legendaryWarriorBuilder() {
		return new Builder(WarriorRarity.LEGENDARY);
	}

	public static Builder mithicWarriorBuilder() {
		return new Builder(WarriorRarity.MITHIC);
	}

	public static class Builder {
		private Long id;
		private String name;
		private String description;
		private WarriorRarity rarity;
		private Damage damage;
		private Armor armor;
		private Health health;
		private Equipment equipment;

		private Builder(WarriorRarity rarity) {
			this.rarity = rarity;
		}

		public Builder withCode(long id) {
			this.id = id;
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

		// TODO Tal vez hay que eliminar este withDamage(Damage)
		public Builder withDamage(Damage damage) {
			this.damage = damage;
			return this;
		}

		public Builder withNoneDamage() {
			this.damage = Damage.NONE;
			return this;
		}

		public Builder withInfiniteDamage() {
			this.damage = Damage.INFINITE;
			return this;
		}

		public Builder withPhysicalDamage(double baseDamage) {
			this.damage = Damage.newInstance(baseDamage, DamageType.PHYSICAL);
			return this;
		}

		public Builder withMagicDamage(double baseDamage) {
			this.damage = Damage.newInstance(baseDamage, DamageType.MAGIC);
			return this;
		}

		public Builder withTrueDamage(double baseDamage) {
			this.damage = Damage.newInstance(baseDamage, DamageType.TRUE);
			return this;
		}

		// TODO Tal vez hay que eliminar este withArmor(Armor)
		public Builder withArmor(Armor armor) {
			this.armor = armor;
			return this;
		}

		public Builder withNoneArmor() {
			this.armor = Armor.NONE;
			return this;
		}

		public Builder withPhysicalArmor(double baseArmor) {
			this.armor = Armor.newInstance(baseArmor, ArmorType.PHYSICAL);
			return this;
		}

		public Builder withMagicArmor(double baseArmor) {
			this.armor = Armor.newInstance(baseArmor, ArmorType.MAGIC);
			return this;
		}

		// TODO Tal vez hay que eliminar este withHealth(Health)
		public Builder withHealth(Health health) {
			this.health = health;
			return this;
		}

		public Builder withInfiniteHealth() {
			this.health = Health.INFINITE;
			return this;
		}

		public Builder withHealth(double value) {
			this.health = Health.newInstance(value);
			return this;
		}

		public Builder withHealth(double value, double maxValue) {
			this.health = Health.newInstance(value, maxValue);
			return this;
		}

		public Builder withEquipment(Equipment equipment) {
			this.equipment = equipment;
			return this;
		}

		public Warrior build() {
			Objects.requireNonNull(this.id);
			Objects.requireNonNull(this.name);
			Objects.requireNonNull(this.damage);
			Objects.requireNonNull(this.armor);
			Objects.requireNonNull(this.health);

			Warrior warrior = new Warrior(this);
			if (this.equipment != null) {
				warrior.equip(this.equipment);
			}

			return warrior;
		}
	}
}
