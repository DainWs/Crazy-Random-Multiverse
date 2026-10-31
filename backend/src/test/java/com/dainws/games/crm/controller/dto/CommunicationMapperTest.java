package com.dainws.games.crm.controller.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.dainws.games.crm.controller.dto.domain.EventDto;
import com.dainws.games.crm.domain.builder.GameBuilder;
import com.dainws.games.crm.domain.core.Game;
import com.dainws.games.crm.domain.core.board.ZoneWithLeader;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;

class CommunicationMapperTest {

	private static final int SEQUENCE = 7;

	@Test
	void testGivenEventWithSequence_whenMapToDto_thenDtoHasTheSameSequence() {
		Game game = new GameBuilder().withZoneFactory(ZoneWithLeader::new).withNRandomPlayers(2).build();
		Event event = new Event(EventCode.TURN_CHANGE, game);
		event.setSequence(SEQUENCE);

		EventDto eventDto = new CommunicationMapper().mapToDto(event, game.getPlayers().get(0));

		assertThat(eventDto.getSequence()).isEqualTo(SEQUENCE);
	}
}
