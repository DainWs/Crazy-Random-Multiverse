package com.dainws.games.crm.controller.events;

import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.player.Player;

public record SentEvent(Player player, Event event) {
}
