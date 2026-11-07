package com.dainws.games.crm.persistence.memory;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardCode;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Equipment;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.exception.NotFoundException;

class MemoryCardRepositoryTest {

	private static final int CARDS = 200;
	private static final long WARRIOR_CODE = 2L;
	private static final long PISTOL_CODE = 0L;
	private static final double BASE_DAMAGE = 5;
	private static final double PISTOL_DAMAGE = 15;

	@Test
	void testGivenSetsFromSeveralThreads_whenHas_thenEveryCardIsKept() {
		MemoryCardRepository repository = new MemoryCardRepository();
		List<Card> cards = IntStream.range(0, CARDS) //
				.mapToObj(number -> CardBuilder.buildCommonWarrior()) //
				.map(Card.class::cast) //
				.toList();

		cards.parallelStream().forEach(repository::set);

		boolean hasEveryCard = cards.stream() //
				.allMatch(card -> repository.has(card.getCode()));
		assertThat(hasEveryCard).isTrue();
	}

	@Test
	void testGivenNullCode_whenHas_thenIsFalse() {
		MemoryCardRepository repository = new MemoryCardRepository();

		assertThat(repository.has(null)).isFalse();
	}

	// CARD-5, CARD-6
	@Test
	void testGivenWarriorWithEquipment_whenFind_thenCopyHasTheDamageOfTheBaseAndTheEquipment() throws NotFoundException {
		MemoryCardRepository repository = new MemoryCardRepository();
		repository.set(this.warriorWithPistol());

		Warrior copy = (Warrior) repository.find(new CardCode(WARRIOR_CODE, CardType.WARRIOR));

		assertThat(copy.getDamage().getValue()).isEqualTo(BASE_DAMAGE + PISTOL_DAMAGE);
	}

	@Test
	void testGivenWarriorWithEquipment_whenFind_thenCopyKeepsTheEquipment() throws NotFoundException {
		MemoryCardRepository repository = new MemoryCardRepository();
		repository.set(this.warriorWithPistol());

		Warrior copy = (Warrior) repository.find(new CardCode(WARRIOR_CODE, CardType.WARRIOR));

		assertThat(copy.getEquipment()).hasSize(1);
	}

	@Test
	void testGivenWarriorWithEquipment_whenFindTwice_thenEachCopyHasItsOwnEquipment() throws NotFoundException {
		MemoryCardRepository repository = new MemoryCardRepository();
		repository.set(this.warriorWithPistol());
		CardCode code = new CardCode(WARRIOR_CODE, CardType.WARRIOR);

		Warrior first = (Warrior) repository.find(code);
		first.equip(Equipment.builder().withCode(PISTOL_CODE).withDamageBuff(PISTOL_DAMAGE).build());
		Warrior second = (Warrior) repository.find(code);

		assertThat(second.getDamage().getValue()).isEqualTo(BASE_DAMAGE + PISTOL_DAMAGE);
	}

	private Warrior warriorWithPistol() {
		return Warrior.uncommonWarriorBuilder() //
				.withCode(WARRIOR_CODE) //
				.withPhysicalDamage(BASE_DAMAGE) //
				.withNoneArmor() //
				.withHealth(10) //
				.withEquipment(Equipment.builder().withCode(PISTOL_CODE).withDamageBuff(PISTOL_DAMAGE).build()) //
				.build();
	}
}
