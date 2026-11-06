package com.dainws.games.crm.domain.mode.classic;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import com.dainws.games.crm.domain.core.card.Card;
import com.dainws.games.crm.domain.core.card.CardType;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.card.WarriorRarity;
import com.dainws.games.crm.domain.core.dealer.Deck;
import com.dainws.games.crm.domain.core.dealer.MemoryDeckPopulator;
import com.dainws.games.crm.persistence.memory.MemoryCardRepository;

class ClassicDealStrategyFactoryTest {

	private static final int RARE_CODE = 4;
	private static final int EPIC_CODE = 5;

	private Deck deck;
	private ClassicDealStrategyFactory factory;

	@BeforeEach
	void beforeEach() {
		MemoryCardRepository fullDeck = (MemoryCardRepository) new MemoryDeckPopulator().populate();
		fullDeck.set(Warrior.rareWarriorBuilder().withCode(RARE_CODE).withNoneArmor().withPhysicalDamage(10)
				.withHealth(10).build());
		fullDeck.set(Warrior.epicWarriorBuilder().withCode(EPIC_CODE).withNoneArmor().withPhysicalDamage(5)
				.withHealth(15).build());
		this.deck = fullDeck;
		this.factory = new ClassicDealStrategyFactory();
	}

	@ParameterizedTest
	@CsvSource({ "1,2", "2,2", "3,1", "4,1", "5,2", "6,1", "7,1", "20,1" })
	void testGivenRound_whenDeal_thenTheScheduledAmountOfCardsIsDrawn(int round, int amount) {
		List<Card> cards = this.factory.createStrategy(round).drawFrom(this.deck);

		assertThat(cards).hasSize(amount);
	}

	@Test
	void testGivenFirstRound_whenDeal_thenTwoCommonWarriorsAreDrawn() {
		List<Card> cards = this.factory.createStrategy(1).drawFrom(this.deck);

		assertThat(cards).allSatisfy(card -> assertThat(((Warrior) card).isRarity(WarriorRarity.COMMON)).isTrue());
	}

	@Test
	void testGivenSecondRound_whenDeal_thenACommonAndAnUncommonWarriorAreDrawn() {
		List<Card> cards = this.factory.createStrategy(2).drawFrom(this.deck);

		assertThat(cards).extracting(card -> ((Warrior) card).getRarity()) //
				.containsExactly(WarriorRarity.COMMON, WarriorRarity.UNCOMMON);
	}

	@ParameterizedTest
	@CsvSource({ "3", "7", "8", "20" })
	void testGivenRoundWithSpellSlot_whenDeal_thenEquipmentIsDrawnWhileSpellsDoNotExist(int round) {
		List<Card> cards = this.factory.createStrategy(round).drawFrom(this.deck);

		assertThat(cards).allSatisfy(card -> assertThat(card.isType(CardType.EQUIPMENT)).isTrue());
	}

	@Test
	void testGivenFifthRound_whenDeal_thenARareWarriorAndEquipmentAreDrawn() {
		List<Card> cards = this.factory.createStrategy(5).drawFrom(this.deck);

		assertThat(cards).extracting(card -> card.isType(CardType.EQUIPMENT)).containsExactly(false, true);
	}

	@Test
	void testGivenFourthRound_whenDeal_thenARareWarriorIsDrawn() {
		List<Card> cards = this.factory.createStrategy(4).drawFrom(this.deck);

		assertThat(((Warrior) cards.get(0)).isRarity(WarriorRarity.RARE)).isTrue();
	}

	@ParameterizedTest
	@CsvSource({ "1", "2", "3", "4", "5", "6", "7" })
	void testGivenDeckWithoutCards_whenDeal_thenNothingIsDealt(int round) {
		List<Card> cards = this.factory.createStrategy(round).drawFrom(new MemoryCardRepository());

		assertThat(cards).isEmpty();
	}

	@Test
	void testGivenSixthRound_whenDeal_thenAnEpicWarriorIsDrawn() {
		List<Card> cards = this.factory.createStrategy(6).drawFrom(this.deck);

		assertThat(((Warrior) cards.get(0)).isRarity(WarriorRarity.EPIC)).isTrue();
	}
}
