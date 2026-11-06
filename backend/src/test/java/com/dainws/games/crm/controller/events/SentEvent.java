package com.dainws.games.crm.controller.events;

import com.dainws.games.crm.controller.dto.response.EventDto;
import com.dainws.games.crm.domain.core.player.Player;

public record SentEvent(Player player, EventDto eventDto) {
}
