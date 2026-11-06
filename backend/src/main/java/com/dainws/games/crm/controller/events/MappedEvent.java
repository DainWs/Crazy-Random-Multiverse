package com.dainws.games.crm.controller.events;

import java.util.Map;

import com.dainws.games.crm.controller.dto.response.EventDto;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.player.Player;

public record MappedEvent(Event event, Map<Player, EventDto> eventsByPlayer) {
}
