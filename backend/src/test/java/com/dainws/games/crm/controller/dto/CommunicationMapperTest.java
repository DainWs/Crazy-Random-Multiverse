package com.dainws.games.crm.controller.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.controller.dto.domain.EventDto;
import com.dainws.games.crm.domain.builder.CardBuilder;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.card.Warrior;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.player.Player;

class CommunicationMapperTest {

	private static final int SEQUENCE = 7;
	private static final int PLAYERS = 2;

	private CommunicationMapper mapper = new CommunicationMapper();

	@Test
	void testGivenEventWithSequence_whenMapToDto_thenDtoHasTheSameSequence() {
		Game game = this.createGame();
		Player receiver = game.getPlayers().get(0);
		Event event = new Event(EventCode.TURN_CHANGE, game);
		event.setSequence(SEQUENCE);

		EventDto eventDto = this.mapper.mapToDto(event, receiver);

		assertThat(eventDto.getSequence()).isEqualTo(SEQUENCE);
	}

	@Test
	void testGivenGameSyncEvent_whenMapToDto_thenDetailsHaveTheHandOfTheReceiver() {
		Game game = this.createGame();
		Player receiver = game.getPlayers().get(0);
		Warrior cardInHand = CardBuilder.buildCommonWarrior();
		receiver.getHand().addCard(cardInHand);
		Event event = new Event(EventCode.GAME_SYNC, game);

		EventDto eventDto = this.mapper.mapToDto(event, receiver);

		assertThat(this.handCodesOf(eventDto))
				.contains(cardInHand.getCode().codeText());
	}

	@Test
	void testGivenGameSyncEvent_whenMapToDto_thenHandDoesNotContainCardsOfOtherPlayers() {
		Game game = this.createGame();
		Player receiver = game.getPlayers().get(0);
		Player other = game.getPlayers().get(1);
		Warrior cardOfOther = CardBuilder.buildCommonWarrior();
		other.getHand().addCard(cardOfOther);
		Event event = new Event(EventCode.GAME_SYNC, game);

		EventDto eventDto = this.mapper.mapToDto(event, receiver);

		assertThat(this.handCodesOf(eventDto))
				.doesNotContain(cardOfOther.getCode().codeText());
	}

	@Test
	void testGivenEventThatIsNotGameSync_whenMapToDto_thenDetailsHaveNoHand() {
		Game game = this.createGame();
		Player receiver = game.getPlayers().get(0);
		Event event = new Event(EventCode.TURN_CHANGE, game);

		EventDto eventDto = this.mapper.mapToDto(event, receiver);

		assertThat(eventDto.getDetails().getHand()).isNull();
	}

	private Game createGame() {
		return new GameBuilder() //
				.withZoneFactory(ZoneWithLeader::new) //
				.withNRandomPlayers(PLAYERS) //
				.build();
	}

	private List<String> handCodesOf(EventDto eventDto) {
		return eventDto.getDetails().getHand().stream() //
				.map(card -> card.getCode().getCode()) //
				.toList();
	}
}
