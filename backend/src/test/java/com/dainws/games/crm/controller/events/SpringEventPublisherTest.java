package com.dainws.games.crm.controller.events;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;

import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.persistence.memory.MemoryEventSequence;

class SpringEventPublisherTest {

	private static final int PLAYERS = 2;

	@Test
	void testGivenTwoEventsOfSameGame_whenPublish_thenSequencesAreConsecutive() {
		List<Object> published = new ArrayList<>();
		SpringEventPublisher publisher = this.createPublisher(published);
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		Event turnChange = new Event(EventCode.TURN_CHANGE, game);
		Event roundChange = new Event(EventCode.ROUND_CHANGE, game);

		publisher.publish(turnChange);
		publisher.publish(roundChange);

		assertThat(published) //
				.extracting(event -> ((Event) event).getSequence()) //
				.containsExactly(1, 2);
	}

	@Test
	void testGivenEventsOfDifferentGames_whenPublish_thenEachGameHasItsOwnSequence() {
		List<Object> published = new ArrayList<>();
		SpringEventPublisher publisher = this.createPublisher(published);
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		Game otherGame = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		Event eventOfGame = new Event(EventCode.TURN_CHANGE, game);
		Event eventOfOtherGame = new Event(EventCode.TURN_CHANGE, otherGame);

		publisher.publish(eventOfGame);
		publisher.publish(eventOfOtherGame);

		assertThat(published) //
				.extracting(event -> ((Event) event).getSequence()) //
				.containsExactly(1, 1);
	}

	private SpringEventPublisher createPublisher(List<Object> published) {
		ApplicationEventPublisher target = published::add;
		MemoryEventSequence sequence = new MemoryEventSequence();
		return new SpringEventPublisher(target, sequence);
	}
}
