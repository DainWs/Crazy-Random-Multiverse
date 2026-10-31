package com.dainws.games.crm.controller.events;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

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
		SpringEventPublisher publisher = new SpringEventPublisher(published::add, new MemoryEventSequence());
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();

		publisher.publish(new Event(EventCode.TURN_CHANGE, game));
		publisher.publish(new Event(EventCode.ROUND_CHANGE, game));

		assertThat(published).extracting(event -> ((Event) event).getSequence()).containsExactly(1, 2);
	}

	@Test
	void testGivenEventsOfDifferentGames_whenPublish_thenEachGameHasItsOwnSequence() {
		List<Object> published = new ArrayList<>();
		SpringEventPublisher publisher = new SpringEventPublisher(published::add, new MemoryEventSequence());
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		Game otherGame = new GameBuilder().withNRandomPlayers(PLAYERS).build();

		publisher.publish(new Event(EventCode.TURN_CHANGE, game));
		publisher.publish(new Event(EventCode.TURN_CHANGE, otherGame));

		assertThat(published).extracting(event -> ((Event) event).getSequence()).containsExactly(1, 1);
	}
}
