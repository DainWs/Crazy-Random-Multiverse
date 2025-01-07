package com.dainws.games.crm.controller.events;

import java.util.List;

import org.springframework.context.event.EventListener;

import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.mode.GameEventDispatcher;
import com.dainws.games.crm.domain.mode.GameModeEventDispatcher;

public class SpringGameEventDispatcher extends GameEventDispatcher {

	public SpringGameEventDispatcher(List<GameModeEventDispatcher> gameModeEventDispatchers) {
		super(gameModeEventDispatchers);
	}

	@Override
	@EventListener
	public void dispatchEvent(Event event) {
		super.dispatchEvent(event);
	}
}
