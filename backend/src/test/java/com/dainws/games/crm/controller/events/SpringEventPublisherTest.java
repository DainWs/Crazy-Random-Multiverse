package com.dainws.games.crm.controller.events;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;

import com.dainws.games.crm.controller.dto.response.EventDto;
import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.TurnManager;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.persistence.memory.MemoryEventSequence;

class SpringEventPublisherTest {

	private static final int PLAYERS = 2;
	private static final int ROUND_AFTER_PUBLISHING = 4;

	@Test
	void testGivenTwoEventsOfSameGame_whenPublish_thenSequencesAreConsecutive() {
		List<Object> published = new ArrayList<>();
		SpringEventPublisher publisher = this.createPublisher(published);
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		Event turnChange = new Event(EventCode.TURN_CHANGE, game);
		Event roundChange = new Event(EventCode.ROUND_CHANGE, game);

		publisher.publish(turnChange);
		publisher.publish(roundChange);

		assertThat(this.eventsIn(published)) //
				.extracting(Event::getSequence) //
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

		assertThat(this.eventsIn(published)) //
				.extracting(Event::getSequence) //
				.containsExactly(1, 1);
	}

	@Test
	void testGivenEvent_whenPublish_thenEveryPlayerOfTheGameGetsItsMapping() {
		List<Object> published = new ArrayList<>();
		SpringEventPublisher publisher = this.createPublisher(published);
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();

		publisher.publish(new Event(EventCode.TURN_CHANGE, game));

		assertThat(this.mappedEventsIn(published).get(0).eventsByPlayer().keySet()) //
				.containsExactlyElementsOf(game.getPlayers());
	}

	@Test
	void testGivenEvent_whenPublish_thenTheMappingKeepsTheSequence() {
		List<Object> published = new ArrayList<>();
		SpringEventPublisher publisher = this.createPublisher(published);
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();

		publisher.publish(new Event(EventCode.TURN_CHANGE, game));

		assertThat(this.mappedEventsIn(published).get(0).eventsByPlayer().values()) //
				.extracting(EventDto::getSequence) //
				.containsOnly(1);
	}

	@Test
	void testGivenEvent_whenPublish_thenTheMappingIsPublishedBeforeTheEvent() {
		List<Object> published = new ArrayList<>();
		SpringEventPublisher publisher = this.createPublisher(published);
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();

		publisher.publish(new Event(EventCode.TURN_CHANGE, game));

		assertThat(published).first().isInstanceOf(MappedEvent.class);
	}

	@Test
	void testGivenGameThatChangesAfterPublishing_whenReadTheMapping_thenItKeepsTheStateOfThePublication() {
		List<Object> published = new ArrayList<>();
		SpringEventPublisher publisher = this.createPublisher(published);
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		publisher.publish(new Event(EventCode.TURN_CHANGE, game));

		new TurnManager().startRound(game, ROUND_AFTER_PUBLISHING);

		EventDto eventDto = this.mappedEventsIn(published).get(0).eventsByPlayer().get(game.getPlayers().get(0));
		assertThat(eventDto.getDetails().getGameDto().getRound()).isNull();
	}

	@Test
	void testGivenCardDealt_whenPublish_thenOnlyTheReceiverGetsTheCard() {
		List<Object> published = new ArrayList<>();
		SpringEventPublisher publisher = this.createPublisher(published);
		Game game = new GameBuilder().withNRandomPlayers(PLAYERS).build();
		Player receiver = game.getPlayers().get(0);
		EventDetails details = new EventDetails(game);
		details.setTargetPlayer(receiver);
		details.setTargetCard(CardBuilder.buildCommonWarrior());

		publisher.publish(new Event(EventCode.PLAYER_RECEIVE_CARD, details));

		Map<Player, EventDto> eventsByPlayer = this.mappedEventsIn(published).get(0).eventsByPlayer();
		assertThat(eventsByPlayer.entrySet()) //
				.filteredOn(entry -> entry.getValue().getDetails().getTargetCard() != null) //
				.extracting(Map.Entry::getKey) //
				.containsExactly(receiver);
	}

	private List<Event> eventsIn(List<Object> published) {
		return published.stream().filter(Event.class::isInstance).map(Event.class::cast).toList();
	}

	private List<MappedEvent> mappedEventsIn(List<Object> published) {
		return published.stream().filter(MappedEvent.class::isInstance).map(MappedEvent.class::cast).toList();
	}

	private SpringEventPublisher createPublisher(List<Object> published) {
		ApplicationEventPublisher target = published::add;
		MemoryEventSequence sequence = new MemoryEventSequence();
		return new SpringEventPublisher(target, sequence);
	}
}
