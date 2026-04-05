package com.dainws.games.crm.event;

import java.util.EnumMap;
import java.util.HashMap;
import java.util.Map;

import org.springframework.context.ApplicationListener;
import org.springframework.context.PayloadApplicationEvent;
import org.springframework.stereotype.Component;

import com.dainws.games.crm.domain.core.GameCode;
import com.dainws.games.crm.domain.core.event.Event;
import com.dainws.games.crm.domain.core.event.EventCode;

@Component
public class GameEventWatcher implements ApplicationListener<PayloadApplicationEvent<Event>> {
	private Map<GameCode, Object> startEventMap;
	private Map<GameCode, Object> endEventMap;
	private Map<EventCode, Map<GameCode, Object>> map;

	public GameEventWatcher() {
		this.startEventMap = new HashMap<>();
		this.endEventMap = new HashMap<>();
		this.map = new EnumMap<>(EventCode.class);
		for (EventCode eventCode : EventCode.values()) {
			this.map.put(eventCode, new HashMap<>());
		}
	}
	
	public void waitForGameStart(GameCode gameCode) throws InterruptedException {
		this.waitForGameStart(gameCode, 10000);
	}
	
	public void waitForGameStart(GameCode gameCode, int miliseconds) throws InterruptedException {
		Object lock = this.registreStartEvent(gameCode);
		synchronized (lock) {
			if (miliseconds == 0) {
				lock.wait();
			} else {
				lock.wait(miliseconds);
			}
		}
	}
	
	public void waitForGameEnd(GameCode gameCode) throws InterruptedException {
		this.waitForGameEnd(gameCode, 0);
	}

	public void waitForGameEnd(GameCode gameCode, int miliseconds) throws InterruptedException {
		Object lock = this.registreEndEvent(gameCode);
		synchronized (lock) {
			if (miliseconds == 0) {
				lock.wait();
			} else {
				lock.wait(miliseconds);
			}
		}
	}

	public void waitForEventInGame(GameCode gameCode, EventCode eventCode) throws InterruptedException {
		Object lock = this.registre(gameCode, eventCode);
		synchronized (lock) {
			lock.wait();
		}
	}

	private Object registre(GameCode gameCode, EventCode eventCode) {
		if (eventCode.equals(EventCode.GAME_START)) {
			return this.registreStartEvent(gameCode);
		}

		if (eventCode.equals(EventCode.GAME_END_WITH_WINNER)) {
			return this.registreEndEvent(gameCode);
		}

		if (eventCode.equals(EventCode.GAME_END_WITH_TIE)) {
			return this.registreEndEvent(gameCode);
		}

		return this.registreSpecific(gameCode, eventCode);
	}

	private Object registreStartEvent(GameCode gameCode) {
		String lock = "start-"+gameCode;
		this.startEventMap.put(gameCode, lock);
		return lock;
	}

	private Object registreEndEvent(GameCode gameCode) {
		String lock = "end-"+gameCode;
		this.endEventMap.put(gameCode, lock);
		return lock;
	}

	private Object registreSpecific(GameCode gameCode, EventCode eventCode) {
		Map<GameCode, Object> games = this.map.get(eventCode);
		if (!games.containsKey(gameCode)) {
			games.put(gameCode, eventCode+"-"+gameCode);
		}
		return games.get(gameCode);
	}

	@Override
	public void onApplicationEvent(PayloadApplicationEvent<Event> payloadEvent) {
		Event event = payloadEvent.getPayload();
		GameCode eventGameCode = event.getDetails().getGame().getCode();

		Object lock = this.grabLock(eventGameCode, event.getCode());
		synchronized (lock) {
			lock.notifyAll();
		}
	}
	
	private Object grabLock(GameCode gameCode, EventCode eventCode) {
		if (eventCode.equals(EventCode.GAME_START)) {
			return this.grabInStartEvent(gameCode);
		}

		if (eventCode.equals(EventCode.GAME_END)) {
			return this.grabInEndEvent(gameCode);
		}

		if (eventCode.equals(EventCode.GAME_END_WITH_WINNER)) {
			return this.grabInEndEvent(gameCode);
		}

		if (eventCode.equals(EventCode.GAME_END_WITH_TIE)) {
			return this.grabInEndEvent(gameCode);
		}

		return this.grabInSpecific(gameCode, eventCode);
	}

	private Object grabInStartEvent(GameCode gameCode) {
		Object lock = this.startEventMap.getOrDefault(gameCode, "start-"+gameCode);
		this.startEventMap.remove(gameCode);
		return lock;
	}

	private Object grabInEndEvent(GameCode gameCode) {
		Object lock = this.endEventMap.getOrDefault(gameCode, "end-"+gameCode);
		this.endEventMap.remove(gameCode);
		return lock;
	}

	private Object grabInSpecific(GameCode gameCode, EventCode eventCode) {
		Map<GameCode, Object> games = this.map.get(eventCode);
		Object lock = games.getOrDefault(gameCode, eventCode+"-"+gameCode);
		games.remove(gameCode);
		return lock;
	}
}
