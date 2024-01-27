package com.dainws.games.cbg.domain.dealer;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.dainws.games.cbg.domain.card.Equipment;
import com.dainws.games.cbg.domain.card.Spell;
import com.dainws.games.cbg.domain.card.Warrior;
import com.dainws.games.cbg.domain.exception.DuplicatedCardException;
import com.dainws.games.cbg.domain.exception.EmptyDeckException;

class DeckBuilderTest {

	Deck.Builder builder;

	@BeforeEach
	void beforeEach() {
		this.builder = Deck.builder();
	}

	@Test
	void testGivenDuplicatedWarrior_whenAddCard_thenThrowDuplicatedCardException() {
		Warrior warrior = Warrior.commonWarriorBuilder()
				.withCode(0L)
				.withName("test-warrior")
				.withDescription("test-warrior_description")
				.withNoneDamage()
				.withNoneArmor()
				.withHealth(100)
				.build();
		this.builder.addCard(warrior);

		assertThrows(DuplicatedCardException.class, () -> this.builder.addCard(warrior));
	}

	@Test
	void testGivenWarrior_whenAddCard_thenDoNotThrowException() {
		Warrior warrior = Warrior.commonWarriorBuilder()
				.withCode(0L)
				.withName("test-warrior")
				.withDescription("test-warrior_description")
				.withNoneDamage()
				.withNoneArmor()
				.withHealth(100)
				.build();

		assertDoesNotThrow(() -> this.builder.addCard(warrior));
	}

	@Test
	void testGivenDuplicatedSpell_whenAddCard_thenThrowDuplicatedCardException() {
		Spell spell = Spell.builder()
				.withCode(1L)
				.withEffect(1L)
				.withName("test-spell")
				.withDescription("test-spell_description")
				.build();
		this.builder.addCard(spell);

		assertThrows(DuplicatedCardException.class, () -> this.builder.addCard(spell));
	}

	@Test
	void testGivenSpell_whenAddCard_thenDoNotThrowException() {
		Spell spell = Spell.builder()
				.withCode(1L)
				.withEffect(1L)
				.withName("test-spell")
				.withDescription("test-spell_description")
				.build();

		assertDoesNotThrow(() -> this.builder.addCard(spell));
	}

	@Test
	void testGivenDuplicatedEquipment_whenAddCard_thenThrowDuplicatedCardException() {
		Equipment equipment = Equipment.builder()
				.withCode(0L)
				.withName("test-equipment")
				.withDescription("test-equipment_description")
				.build();
		this.builder.addCard(equipment);

		assertThrows(DuplicatedCardException.class, () -> this.builder.addCard(equipment));
	}

	@Test
	void testGivenEquipment_whenAddCard_thenDoNotThrowException() {
		Equipment equipment = Equipment.builder()
				.withCode(0L)
				.withName("test-equipment")
				.withDescription("test-equipment_description")
				.build();

		assertDoesNotThrow(() -> this.builder.addCard(equipment));
	}

	@Test
	void testGivenDeckBuilderWithoutCards_whenBuild_thenThrowEmptyDeckException() {
		assertThrows(EmptyDeckException.class, () -> this.builder.build());	
	}

	@Test
	void testGivenDeckBuilderWithCards_whenBuild_thenDoNotThrowException() {
		Equipment equipment = Equipment.builder()
				.withCode(0L)
				.withName("test-equipment")
				.withDescription("test-equipment_description")
				.build();
		this.builder.addCard(equipment);

		assertDoesNotThrow(() -> this.builder.build());
	}
}
