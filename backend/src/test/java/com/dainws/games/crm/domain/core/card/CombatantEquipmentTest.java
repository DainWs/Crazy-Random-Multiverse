package com.dainws.games.crm.domain.core.card;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.core.card.statistics.ArmorType;
import com.dainws.games.crm.domain.core.card.statistics.DamageType;

class CombatantEquipmentTest {

	private static final long CODE = 1L;

	@Test
	void testGivenSeveralPieces_whenEquip_thenDamageAddsUp() {
		Warrior warrior = this.warriorWith(5, 0, 10);

		warrior.equip(this.equipmentWithDamage(5));
		warrior.equip(this.equipmentWithDamage(10));

		assertEquals(20, warrior.getDamage().getValue());
	}

	@Test
	void testGivenSeveralPieces_whenGetEquipment_thenAllOfThemAreListed() {
		Warrior warrior = this.warriorWith(5, 0, 10);

		warrior.equip(this.equipmentWithDamage(5));
		warrior.equip(this.equipmentWithDamage(10));

		assertEquals(2, warrior.getEquipment().size());
	}

	@Test
	void testGivenWarriorWithTwoHealth_whenEquipPieceWithHealthPenalty_thenHealthIsOne() {
		Warrior warrior = this.warriorWith(5, 0, 2);

		warrior.equip(Equipment.builder().withCode(CODE).withHealthDebuff(5).build());

		assertEquals(1, warrior.getHealth().getValue());
	}

	@Test
	void testGivenWarriorWithTwoHealth_whenEquipPieceWithHealthPenalty_thenWarriorIsAlive() {
		Warrior warrior = this.warriorWith(5, 0, 2);

		warrior.equip(Equipment.builder().withCode(CODE).withHealthDebuff(5).build());

		assertTrue(warrior.isAlive());
	}

	@Test
	void testGivenWarriorWithThreeDamage_whenEquipPenaltyThenBonus_thenLimitAppliesToTheTotal() {
		Warrior warrior = this.warriorWith(3, 0, 10);

		warrior.equip(Equipment.builder().withCode(CODE).withDamageDebuff(5).build());
		warrior.equip(this.equipmentWithDamage(4));

		assertEquals(2, warrior.getDamage().getValue());
	}

	@Test
	void testGivenWarriorWithoutArmorOfMagicType_whenEquipArmor_thenArmorHasTheMagicType() {
		Warrior warrior = Warrior.commonWarriorBuilder()
				.withCode(CODE)
				.withPhysicalDamage(5)
				.withArmor(com.dainws.games.crm.domain.core.card.statistics.Armor.newInstance(0, ArmorType.MAGIC))
				.withHealth(10)
				.build();

		warrior.equip(Equipment.builder().withCode(CODE).withArmor(5).build());

		assertEquals(ArmorType.MAGIC, warrior.getArmor().getType());
	}

	@Test
	void testGivenWarriorWithoutArmorOfMagicType_whenEquipArmor_thenArmorHasTheValue() {
		Warrior warrior = Warrior.commonWarriorBuilder()
				.withCode(CODE)
				.withPhysicalDamage(5)
				.withArmor(com.dainws.games.crm.domain.core.card.statistics.Armor.newInstance(0, ArmorType.MAGIC))
				.withHealth(10)
				.build();

		warrior.equip(Equipment.builder().withCode(CODE).withArmor(5).build());

		assertEquals(5, warrior.getArmor().getValue());
	}

	@Test
	void testGivenWarriorWithoutDamageOfMagicType_whenEquipDamage_thenDamageHasTheMagicType() {
		Warrior warrior = Warrior.commonWarriorBuilder()
				.withCode(CODE)
				.withDamage(com.dainws.games.crm.domain.core.card.statistics.Damage.newInstance(0, DamageType.MAGIC))
				.withNoneArmor()
				.withHealth(10)
				.build();

		warrior.equip(this.equipmentWithDamage(5));

		assertEquals(DamageType.MAGIC, warrior.getDamage().getType());
	}

	@Test
	void testGivenHealthBonus_whenEquip_thenCurrentAndMaximumHealthRise() {
		Warrior warrior = this.warriorWith(5, 0, 10);

		warrior.equip(Equipment.builder().withCode(CODE).withHealthBuff(5).build());

		assertEquals(15, warrior.getHealth().getValue());
		assertEquals(15, warrior.getHealth().getMaxValue());
	}

	@Test
	void testGivenWarriorThatLostHealth_whenEquipHealthBonus_thenTheDamageTakenIsKept() {
		Warrior warrior = this.warriorWith(5, 0, 10);
		warrior.receiveDamageFrom(this.warriorWith(4, 0, 10));

		warrior.equip(Equipment.builder().withCode(CODE).withHealthBuff(5).build());

		assertEquals(11, warrior.getHealth().getValue());
		assertEquals(15, warrior.getHealth().getMaxValue());
	}

	@Test
	void testGivenWarriorThatLostArmor_whenEquipArmorBonus_thenTheArmorTakenIsKept() {
		Warrior warrior = this.warriorWith(5, 10, 10);
		warrior.receiveDamageFrom(this.warriorWith(4, 0, 10));

		warrior.equip(Equipment.builder().withCode(CODE).withArmor(5).build());

		assertEquals(11, warrior.getArmor().getValue());
	}

	private Equipment equipmentWithDamage(double amount) {
		return Equipment.builder().withCode(CODE).withDamageBuff(amount).build();
	}

	private Warrior warriorWith(double damage, double armor, double health) {
		return Warrior.commonWarriorBuilder()
				.withCode(CODE)
				.withPhysicalDamage(damage)
				.withPhysicalArmor(armor)
				.withHealth(health)
				.build();
	}
}
