package com.dainws.games.crm.domain.core.event;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dainws.games.crm.domain.core.GameCode;

@Deprecated
public class EventObserver {

	private static EventObserver instance;

	public synchronized static EventObserver getInstance() {
		if (instance == null) {
			instance = new EventObserver();
		}

		return instance;
	}

	private Map<GameCode, List<EventListener>> listeners;

	private EventObserver() {
		this.listeners = new HashMap<>();
	}

	public void subscribe(GameCode code, EventListener eventListener) {
		List<EventListener> eventListeners = this.get(code);
		eventListeners.add(eventListener);
		this.listeners.put(code, eventListeners);
	}

	public void unsubscribe(GameCode code) {
		this.listeners.remove(code);
	}

	public void publish(Event event) {
		GameCode gameCode = event.getGameCode();
		for (EventListener eventListener : this.get(gameCode)) {
			eventListener.handle(event);
		}
	}

	private List<EventListener> get(GameCode code) {
		return this.listeners.getOrDefault(code, new ArrayList<>());
	}
}
