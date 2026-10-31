package com.dainws.games.crm.persistence.memory;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.core.card.Card;

class MemoryCardRepositoryTest {

	private static final int CARDS = 200;

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
}
