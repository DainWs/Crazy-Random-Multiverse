package com.dainws.games.crm.controller.events;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import com.dainws.games.crm.controller.dto.CommunicationMapper;
import com.dainws.games.crm.controller.dto.response.EventDto;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;
import com.dainws.games.crm.domain.core.event.EventDetails;
import com.dainws.games.crm.domain.core.event.EventPublisher;
import com.dainws.games.crm.domain.core.player.Player;
import com.dainws.games.crm.persistence.memory.MemoryEventSequence;

@Component
public class SpringEventPublisher implements EventPublisher {

	private ApplicationEventPublisher applicationEventPublisher;
	private MemoryEventSequence eventSequence;

	public SpringEventPublisher(ApplicationEventPublisher applicationEventPublisher, MemoryEventSequence eventSequence) {
		this.applicationEventPublisher = applicationEventPublisher;
		this.eventSequence = eventSequence;
	}

	@Override
	public void publish(EventCode code) {
		this.publish(code, new EventDetails(null));
	}

	@Override
	public void publish(EventCode code, EventDetails details) {
		this.publish(new Event(code, details));
	}

	@Override
	public void publish(Event event) {
		event.setSequence(this.eventSequence.next(event.getGameCode()));
		this.applicationEventPublisher.publishEvent(this.mapForEachPlayer(event));
		this.applicationEventPublisher.publishEvent(event);
	}

	private MappedEvent mapForEachPlayer(Event event) {
		CommunicationMapper mapper = new CommunicationMapper();

		Map<Player, EventDto> eventsByPlayer = new LinkedHashMap<>();
		for (Player player : event.getDetails().getGame().getPlayers()) {
			eventsByPlayer.put(player, mapper.mapToDto(event, player));
		}

		return new MappedEvent(event, eventsByPlayer);
	}
}
